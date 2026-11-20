const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function runProfiler() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cdpPort = 9290;
  const proc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    '--headless=new',
    '--disable-gpu-vsync',
    '--window-size=1280,950',
    'about:blank'
  ]);

  function get(url) {
    return new Promise((res, rej) => {
      http.get(url, r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });
  }

  let list = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      list = await get(`http://127.0.0.1:${cdpPort}/json/list`);
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

  console.log('====================================================');
  console.log('STARTING AUTOMATED WEBSITE LAG & PERFORMANCE PROFILE');
  console.log('====================================================\n');

  async function benchmarkPage(url, pageName, testFn) {
    console.log(`>>> Benchmarking ${pageName} (${url}) ...`);
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 6000));

    // Dismiss preloader if present
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
    await new Promise(r => setTimeout(r, 1000));

    // Install high-precision frame duration observer
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          window.__perfStats = {
            totalFrames: 0,
            longFrames: [], // > 50ms (noticeable hitch)
            mediumDrops: [], // 30ms - 50ms (stutter)
            frameDurations: []
          };
          let lastTime = performance.now();
          window.__perfActive = true;
          function recordFrame(now) {
            if (!window.__perfActive) return;
            const dt = now - lastTime;
            lastTime = now;
            window.__perfStats.totalFrames++;
            window.__perfStats.frameDurations.push(dt);
            if (dt > 50) {
              window.__perfStats.longFrames.push({
                durationMs: Math.round(dt),
                scrollY: Math.round(window.scrollY),
                time: Math.round(now)
              });
            } else if (dt > 33) {
              window.__perfStats.mediumDrops.push({
                durationMs: Math.round(dt),
                scrollY: Math.round(window.scrollY),
                time: Math.round(now)
              });
            }
            requestAnimationFrame(recordFrame);
          }
          requestAnimationFrame(recordFrame);
        })()
      `
    });

    // Run test actions
    await testFn();

    // Collect stats
    const statsRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          window.__perfActive = false;
          const durations = window.__perfStats.frameDurations;
          durations.sort((a,b) => a - b);
          const p50 = durations[Math.floor(durations.length * 0.50)] || 0;
          const p95 = durations[Math.floor(durations.length * 0.95)] || 0;
          const p99 = durations[Math.floor(durations.length * 0.99)] || 0;
          const max = durations[durations.length - 1] || 0;
          return {
            totalFrames: window.__perfStats.totalFrames,
            longFramesCount: window.__perfStats.longFrames.length,
            mediumDropsCount: window.__perfStats.mediumDrops.length,
            longFrames: window.__perfStats.longFrames.slice(0, 8),
            p50Ms: Math.round(p50 * 10) / 10,
            p95Ms: Math.round(p95 * 10) / 10,
            p99Ms: Math.round(p99 * 10) / 10,
            maxMs: Math.round(max * 10) / 10
          };
        })()
      `
    });

    const s = statsRes.result?.value;
    console.log(`Results for ${pageName}:`);
    console.log(`  Total Frames: ${s.totalFrames}`);
    console.log(`  p50 frame: ${s.p50Ms}ms (~${Math.round(1000/s.p50Ms)} FPS)`);
    console.log(`  p95 frame: ${s.p95Ms}ms`);
    console.log(`  p99 frame: ${s.p99Ms}ms`);
    console.log(`  Max Frame Duration: ${s.maxMs}ms`);
    console.log(`  Stutters (33-50ms): ${s.mediumDropsCount}`);
    console.log(`  Lag/Jank Hitches (>50ms): ${s.longFramesCount}`);
    if (s.longFramesCount > 0) {
      console.log(`  Sample Hitches:`, JSON.stringify(s.longFrames));
    }
    console.log('----------------------------------------------------\n');
  }

  // 1. Home Page: Full scroll down and scroll back up
  await benchmarkPage('http://localhost:3000', 'Home Page (Scroll Down & Up)', async () => {
    // Scroll down incrementally
    for (let y = 0; y <= 4500; y += 150) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
      await new Promise(r => setTimeout(r, 60));
    }
    await new Promise(r => setTimeout(r, 500));

    console.log('  ... now scrolling UP back to top (testing unpin/hero return) ...');
    // Scroll back up
    for (let y = 4500; y >= 0; y -= 150) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
      await new Promise(r => setTimeout(r, 60));
    }
    await new Promise(r => setTimeout(r, 500));
  });

  // 2. Gallery Horizontal Scroll (on Home page)
  await benchmarkPage('http://localhost:3000#gallery', 'Home Page (Gallery Horizontal Scroll)', async () => {
    // Scroll into gallery view
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const g = document.getElementById('gallery');
          if (g) g.scrollIntoView({ behavior: 'instant' });
        })()
      `
    });
    await new Promise(r => setTimeout(r, 800));

    console.log('  ... simulating horizontal gallery drag right 1800px ...');
    for (let step = 0; step < 20; step++) {
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const track = document.querySelector('[data-lenis-prevent="true"]') || document.querySelector('section#gallery');
            // Trigger wheel or button clicks
            const btns = document.querySelectorAll('section#gallery button');
            if (btns[1]) btns[1].click();
          })()
        `
      });
      await new Promise(r => setTimeout(r, 100));
    }

    console.log('  ... simulating horizontal gallery drag left 1800px ...');
    for (let step = 0; step < 20; step++) {
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const btns = document.querySelectorAll('section#gallery button');
            if (btns[0]) btns[0].click();
          })()
        `
      });
      await new Promise(r => setTimeout(r, 100));
    }
    await new Promise(r => setTimeout(r, 600));
  });

  // 3. /gallery Page
  await benchmarkPage('http://localhost:3000/gallery', 'Dedicated Gallery Page (/gallery)', async () => {
    for (let step = 0; step < 15; step++) {
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const btns = document.querySelectorAll('section#gallery button');
            if (btns[1]) btns[1].click();
          })()
        `
      });
      await new Promise(r => setTimeout(r, 120));
    }
  });

  // 4. /events Page
  await benchmarkPage('http://localhost:3000/events', 'Events Page (/events)', async () => {
    for (let y = 0; y <= 2000; y += 180) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
      await new Promise(r => setTimeout(r, 60));
    }
    for (let y = 2000; y >= 0; y -= 180) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
      await new Promise(r => setTimeout(r, 60));
    }
  });

  // 5. /more-music Page
  await benchmarkPage('http://localhost:3000/more-music', 'Music Page (/more-music)', async () => {
    for (let y = 0; y <= 2000; y += 180) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
      await new Promise(r => setTimeout(r, 60));
    }
    for (let y = 2000; y >= 0; y -= 180) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
      await new Promise(r => setTimeout(r, 60));
    }
  });

  // 6. /contact Page
  await benchmarkPage('http://localhost:3000/contact', 'Contact Page (/contact)', async () => {
    for (let y = 0; y <= 1500; y += 150) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
      await new Promise(r => setTimeout(r, 60));
    }
    for (let y = 1500; y >= 0; y -= 150) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
      await new Promise(r => setTimeout(r, 60));
    }
  });

  ws.close();
  proc.kill();
  console.log('====================================================');
  console.log('PROFILING COMPLETED');
  console.log('====================================================');
}

runProfiler().catch(console.error);
