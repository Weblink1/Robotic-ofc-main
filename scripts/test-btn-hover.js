const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testHover() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cdpPort = 9299;
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

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const chk = await send('Runtime.evaluate', {
      expression: 'Boolean(document.querySelector(\'[data-action="open-booking"]\'))'
    });
    if (chk?.result?.value === true) {
      console.log('Buttons present in DOM!');
      break;
    }
  }

  // Dismiss preloader
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.querySelectorAll('[data-preloader-root="true"]').forEach(e => e.remove());
        const spans = Array.from(document.querySelectorAll('span'));
        const zero = spans.find(s => s.innerText.trim().includes('%'));
        if (zero) zero.closest('div[class*="fixed"]')?.remove();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1000));

  // Get positions of buttons
  const pos = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const bookBtn = document.querySelector('[data-action="open-booking"]');
        const listenBtn = document.querySelector('a[href="/more-music"]');
        const rb = bookBtn?.getBoundingClientRect();
        const rl = listenBtn?.getBoundingClientRect();
        return {
          book: rb ? { x: rb.x, y: rb.y, width: rb.width, height: rb.height } : null,
          listen: rl ? { x: rl.x, y: rl.y, width: rl.width, height: rl.height } : null,
        };
      })()
    `,
    returnByValue: true
  });

  const { book, listen } = pos.result.value;
  console.log('Book button box:', book);
  console.log('Listen button box:', listen);

  if (!book || !listen) {
    console.error('Buttons not found!');
    process.exit(1);
  }

  // 1. Capture at rest
  const restShot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: Math.round(book.x - 30),
      y: Math.round(book.y - 20),
      width: Math.round(Math.max(book.width, listen.width) + 60),
      height: Math.round((listen.y + listen.height - book.y) + 40),
      scale: 1
    }
  });
  fs.writeFileSync('scripts/buttons-rest.png', Buffer.from(restShot.data, 'base64'));
  console.log('Saved scripts/buttons-rest.png');

  // 2. Dispatch hover on Book button
  await send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: Math.round(book.x + book.width / 2),
    y: Math.round(book.y + book.height / 2)
  });
  await new Promise(r => setTimeout(r, 600));

  const bookHoverShot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: Math.round(book.x - 30),
      y: Math.round(book.y - 20),
      width: Math.round(book.width + 60),
      height: Math.round(book.height + 40),
      scale: 1
    }
  });
  fs.writeFileSync('scripts/book-robotic-hover.png', Buffer.from(bookHoverShot.data, 'base64'));
  console.log('Saved scripts/book-robotic-hover.png');

  // 3. Dispatch hover on Listen button
  await send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: Math.round(listen.x + listen.width / 2),
    y: Math.round(listen.y + listen.height / 2)
  });
  await new Promise(r => setTimeout(r, 600));

  const listenHoverShot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: Math.round(listen.x - 30),
      y: Math.round(listen.y - 20),
      width: Math.round(listen.width + 60),
      height: Math.round(listen.height + 40),
      scale: 1
    }
  });
  fs.writeFileSync('scripts/listen-now-hover.png', Buffer.from(listenHoverShot.data, 'base64'));
  console.log('Saved scripts/listen-now-hover.png');

  ws.close();
  proc.kill();
  process.exit(0);
}

testHover().catch(err => {
  console.error(err);
  process.exit(1);
});
