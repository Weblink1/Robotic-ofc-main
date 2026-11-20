const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testHydration() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cdpPort = 9275;
  const proc = spawn(edgePath, ['--remote-debugging-port=' + cdpPort, '--headless=new', '--window-size=1280,950', 'about:blank']);

  function get(url) {
    return new Promise((res, rej) => {
      http.get(url, r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });
  }

  let list = null;
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 600));
    try {
      list = await get('http://127.0.0.1:' + cdpPort + '/json/list');
      if (list && list.length > 0) break;
    } catch {}
  }
  const page = list.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let idSeq = 1;
  const pending = new Map();
  function send(method, params = {}) {
    return new Promise(r => {
      const id = idSeq++;
      pending.set(id, r);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = e => {
    const res = JSON.parse(e.data.toString());
    if (res.method === 'Runtime.consoleAPICalled') {
      console.log('BROWSER LOG:', res.params.type, res.params.args.map(a => a.value ?? a.description).join(' '));
    }
    if (res.id && pending.has(res.id)) {
      pending.get(res.id)(res.result);
      pending.delete(res.id);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Navigating to http://localhost:3000 ...');
  await send('Page.navigate', { url: 'http://localhost:3000' });

  // Poll until hydrated or up to 25 seconds
  let hydrated = false;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const check = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            hasOpenBooking: typeof window.__openBookingModal === 'function',
            scripts: document.querySelectorAll('script').length,
            title: document.title
          };
        })()
      `,
      returnByValue: true
    });
    if (check.result?.value?.hasOpenBooking) {
      console.log(`React Hydrated on iteration ${i+1}!`, check.result.value);
      hydrated = true;
      break;
    }
  }

  console.log('Hydrated status:', hydrated);

  // Dismiss preloader
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.querySelectorAll('[data-preloader-root="true"]').forEach(e => e.remove());
        const spans = Array.from(document.querySelectorAll('span'));
        const zero = spans.find(s => s.innerText.trim() === '0%');
        if (zero) zero.closest('div[class*="fixed"]')?.remove();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 500));

  // Click Book Robotic button
  console.log('Clicking [data-action="open-booking"] ...');
  const clickRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('[data-action="open-booking"]');
        if (btn) {
          btn.click();
          return { clicked: true };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });
  console.log('Click result:', clickRes.result.value);
  await new Promise(r => setTimeout(r, 1500));

  // Check modal
  const modalCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const modalContainer = document.querySelector('[data-lenis-prevent="true"]');
        const h2 = document.querySelector('h2');
        const inputs = Array.from(document.querySelectorAll('input')).map(i => i.name);
        return {
          hasModal: !!modalContainer,
          h2: h2 ? h2.innerText : null,
          inputs,
          scrollTop: modalContainer ? modalContainer.scrollTop : -1,
          scrollHeight: modalContainer ? modalContainer.scrollHeight : -1,
          clientHeight: modalContainer ? modalContainer.clientHeight : -1
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Modal Check Result:', modalCheck.result.value);

  const shotModal1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/home-modal-clean.png', Buffer.from(shotModal1.data, 'base64'));
  console.log('Saved scripts/home-modal-clean.png');

  // Test scroll
  console.log('Scrolling modal container down 320px ...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const c = document.querySelector('[data-lenis-prevent="true"]');
        if (c) {
          c.scrollTop = 320;
          return { scrolledTop: c.scrollTop };
        }
        return null;
      })()
    `,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 600));

  const shotModal2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/home-modal-scrolled.png', Buffer.from(shotModal2.data, 'base64'));
  console.log('Saved scripts/home-modal-scrolled.png');

  // Scroll to bottom
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const c = document.querySelector('[data-lenis-prevent="true"]');
        if (c) c.scrollTop = 750;
      })()
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const shotModal3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/home-modal-bottom.png', Buffer.from(shotModal3.data, 'base64'));
  console.log('Saved scripts/home-modal-bottom.png');

  ws.close();
  proc.kill();
  console.log('Test completed successfully.');
}

testHydration().catch(console.error);
