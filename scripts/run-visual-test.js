const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cdpPort = 9232;
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

  let loadFiredCallback = null;
  ws.onmessage = (event) => {
    const msg = typeof event.data === 'string' ? event.data : event.data.toString();
    const res = JSON.parse(msg);
    if (res.method === 'Page.loadEventFired' && loadFiredCallback) {
      loadFiredCallback();
    }
    if (res.id && pending.has(res.id)) {
      pending.get(res.id)(res.result);
      pending.delete(res.id);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  async function navigateAndWait(url) {
    console.log(`Navigating to ${url} ...`);
    const p = new Promise(resolve => { loadFiredCallback = resolve; });
    await send('Page.navigate', { url });
    await p;
    loadFiredCallback = null;
    console.log(`Page load fired for ${url}, waiting 3s for hydration...`);
    await new Promise(r => setTimeout(r, 3000));
  }

  // 1. Check contact page
  await navigateAndWait('http://localhost:3000/contact');

  // Clear any preloader remnants
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.querySelectorAll('[data-preloader-root="true"]').forEach(e => e.remove());
        const spans = Array.from(document.querySelectorAll('span'));
        const zeroPercent = spans.find(s => s.innerText.trim() === '0%');
        if (zeroPercent) zeroPercent.closest('div[class*="fixed"]')?.remove();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 500));

  const contactCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const h1 = document.querySelector('h1')?.innerText;
        const inputs = Array.from(document.querySelectorAll('input')).map(i => i.name);
        return { h1, inputs };
      })()
    `,
    returnByValue: true
  });
  console.log('Contact Page Check:', contactCheck.result.value);

  const contactShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/contact-page-clean.png', Buffer.from(contactShot.data, 'base64'));
  console.log('Saved scripts/contact-page-clean.png');

  // 2. Check Home page
  await navigateAndWait('http://localhost:3000');

  // Clear preloader
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.querySelectorAll('[data-preloader-root="true"]').forEach(e => e.remove());
        const spans = Array.from(document.querySelectorAll('span'));
        const zeroPercent = spans.find(s => s.innerText.trim() === '0%');
        if (zeroPercent) zeroPercent.closest('div[class*="fixed"]')?.remove();
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
          return { clicked: true, text: btn.innerText };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });
  console.log('Click result:', clickRes.result.value);
  await new Promise(r => setTimeout(r, 1200));

  const modalCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const modal = document.querySelector('[data-lenis-prevent="true"]');
        const inputs = Array.from(document.querySelectorAll('input')).map(i => i.name);
        return {
          hasModal: !!modal,
          inputs,
          scrollTop: modal ? modal.scrollTop : -1,
          scrollHeight: modal ? modal.scrollHeight : -1,
          clientHeight: modal ? modal.clientHeight : -1
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Modal Check on Home:', modalCheck.result.value);

  const homeShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/home-modal-clean.png', Buffer.from(homeShot.data, 'base64'));
  console.log('Saved scripts/home-modal-clean.png');

  // Scroll modal
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const modal = document.querySelector('[data-lenis-prevent="true"]');
        if (modal) {
          modal.scrollTop = 320;
          return { scrolledTop: modal.scrollTop };
        }
        return null;
      })()
    `,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 600));

  const scrolledShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/home-modal-scrolled.png', Buffer.from(scrolledShot.data, 'base64'));
  console.log('Saved scripts/home-modal-scrolled.png');

  ws.close();
  proc.kill();
  console.log('Complete.');
}

run().catch(console.error);
