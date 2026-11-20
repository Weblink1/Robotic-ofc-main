const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cdpPort = 9231;
  const proc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--window-size=1280,950',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  function get(url) {
    return new Promise((resolve, reject) => {
      http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  const list = await get(`http://127.0.0.1:${cdpPort}/json/list`);
  const page = list.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let idSeq = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = idSeq++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = typeof event.data === 'string' ? event.data : event.data.toString();
    const res = JSON.parse(msg);
    if (res.method === 'Runtime.consoleAPICalled') {
      console.log('BROWSER CONSOLE:', res.params.type, res.params.args.map(a => a.value ?? a.description).join(' '));
    }
    if (res.id && pending.has(res.id)) {
      pending.get(res.id)(res.result);
      pending.delete(res.id);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  console.log('1. Navigating to http://localhost:3000/contact ...');
  await send('Page.navigate', { url: 'http://localhost:3000/contact' });
  await new Promise(r => setTimeout(r, 6000));

  // Remove preloader completely
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const p = document.querySelector('[data-preloader-root="true"]') || document.querySelector('.z-9999');
        if (p) p.remove();
        document.querySelectorAll("[class*='pre-loader']").forEach(e => e.remove());
      })()
    `
  });
  await new Promise(r => setTimeout(r, 800));

  const shotContact = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/contact-page-screenshot.png', Buffer.from(shotContact.data, 'base64'));
  console.log('Saved contact page screenshot.');

  console.log('2. Navigating to http://localhost:3000 ...');
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 7000));

  // Remove preloader on home
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const p = document.querySelector('[data-preloader-root="true"]') || document.querySelector('.z-9999');
        if (p) p.remove();
        document.querySelectorAll("[class*='pre-loader']").forEach(e => e.remove());
      })()
    `
  });
  await new Promise(r => setTimeout(r, 800));

  // Trigger modal
  console.log('Triggering booking modal ...');
  const trig = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('[data-action="open-booking"]') || document.querySelector('.book-robotic-btn')?.closest('button');
        if (btn) {
          btn.click();
          return { method: 'btn-click', btnFound: true };
        }
        window.dispatchEvent(new CustomEvent('open-booking-modal'));
        return { method: 'custom-event', btnFound: false };
      })()
    `,
    returnByValue: true
  });
  console.log('Trigger response:', trig.result.value);

  await new Promise(r => setTimeout(r, 1500));

  const checkModal = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const modalContainer = document.querySelector('[data-lenis-prevent="true"]');
        const form = document.querySelector('form');
        const heading = document.querySelector('h2');
        return {
          hasModalContainer: !!modalContainer,
          hasForm: !!form,
          heading: heading ? heading.innerText : null,
          scrollTop: modalContainer ? modalContainer.scrollTop : -1,
          scrollHeight: modalContainer ? modalContainer.scrollHeight : -1,
          clientHeight: modalContainer ? modalContainer.clientHeight : -1
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Modal status on Home:', checkModal.result.value);

  const shotModal1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/booking-modal-screenshot.png', Buffer.from(shotModal1.data, 'base64'));
  console.log('Saved booking modal top screenshot.');

  // Scroll modal down
  console.log('Scrolling modal container down ...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const c = document.querySelector('[data-lenis-prevent="true"]');
        if (c) {
          c.scrollTop = 380;
          return { scrolledTo: c.scrollTop };
        }
        return null;
      })()
    `,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 800));

  const shotModal2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/booking-modal-scrolled.png', Buffer.from(shotModal2.data, 'base64'));
  console.log('Saved booking modal scrolled screenshot.');

  ws.close();
  proc.kill();
  console.log('Finished testing.');
}

test().catch(console.error);
