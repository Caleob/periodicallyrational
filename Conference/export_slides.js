const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const OUTPUT_DIR = path.join(__dirname, 'slides_export');
const WIDTH = 1920;
const HEIGHT = 1080;
const DEBUG_PORT = 9222;

// Check chrome or msedge paths
function getBrowserPath() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('Neither Chrome nor Edge was found at standard locations.');
}

// Simple HTTP static server
function startServer(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0].split('#')[0]);
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
      const filePath = path.join(__dirname, reqPath);

      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.mp3': 'audio/mpeg'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Minimal WebSocket client implementation using node's built-in net or simple protocol
// Alternatively, CDP commands can be executed via CDP HTTP endpoints or lightweight WebSocket
class CdpSession {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    // Node.js 22+ has built-in WebSocket support!
    if (typeof WebSocket !== 'undefined') {
      this.ws = new WebSocket(this.wsUrl);
    } else {
      // Fallback: try global WebSocket or require
      const WS = global.WebSocket || require('ws');
      this.ws = new WS(this.wsUrl);
    }

    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(typeof event.data === 'string' ? event.data : event.data.toString());
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) {
      try { this.ws.close(); } catch (_) {}
    }
  }
}

async function main() {
  console.log('=====================================================');
  console.log('   The Classroom Genie - Static Slide Exporter');
  console.log('=====================================================');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browserPath = getBrowserPath();
  console.log('Using browser:', browserPath);

  const serverPort = 8765;
  const server = await startServer(serverPort);
  console.log(`Local preview server running at http://127.0.0.1:${serverPort}`);

  // Create clean user data dir for isolation
  const userDataDir = path.join(__dirname, '.chrome_export_profile');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const browserArgs = [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${userDataDir}`,
    `--window-size=${WIDTH},${HEIGHT}`,
    '--hide-scrollbars',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `http://127.0.0.1:${serverPort}/index.html#slide-1`
  ];

  console.log('Launching headless browser...');
  const browserProc = spawn(browserPath, browserArgs, { stdio: 'ignore' });

  // Wait for debug port
  let targets = null;
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    try {
      targets = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json`);
      if (targets && targets.length > 0) break;
    } catch (_) {}
  }

  if (!targets || targets.length === 0) {
    browserProc.kill();
    server.close();
    throw new Error('Failed to connect to browser debug port');
  }

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  console.log('Connected to page session.');

  const cdp = new CdpSession(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();

  try {
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Wait for page to initialize
    await sleep(800);

    // Turn on export mode in app
    await cdp.send('Runtime.evaluate', {
      expression: 'window.__slideController.setExportMode(true);'
    });

    const countRes = await cdp.send('Runtime.evaluate', {
      expression: 'window.__slideController.getSlideCount()',
      returnByValue: true
    });
    const slideCount = countRes.result.value || 13;
    console.log(`Total slides found: ${slideCount}`);
    console.log(`Exporting 16:9 images (${WIDTH}x${HEIGHT}) to: slides_export/\n`);

    let totalSaved = 0;

    for (let s = 1; s <= slideCount; s++) {
      // Navigate to slide
      await cdp.send('Runtime.evaluate', {
        expression: `window.__slideController.goToSlide(${s});`
      });
      await sleep(150);

      // Query animation count
      const animRes = await cdp.send('Runtime.evaluate', {
        expression: 'window.__slideController.getAnimState()',
        returnByValue: true
      });
      const { total } = animRes.result.value;

      // Frame 1: initial view of the slide
      const frame1Name = `S${s}_1.png`;
      const shot1 = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUTPUT_DIR, frame1Name), Buffer.from(shot1.data, 'base64'));
      totalSaved++;
      process.stdout.write(`Slide ${s.toString().padStart(2, ' ')}: Saved ${frame1Name}`);

      // If slide has reveal steps, step through each and capture
      if (total > 0) {
        for (let step = 1; step <= total; step++) {
          await cdp.send('Runtime.evaluate', {
            expression: 'window.__slideController.stepAnim();'
          });
          await sleep(100);
          const frameName = `S${s}_${step + 1}.png`;
          const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
          fs.writeFileSync(path.join(OUTPUT_DIR, frameName), Buffer.from(shot.data, 'base64'));
          totalSaved++;
          process.stdout.write(`, ${frameName}`);
        }
      }
      process.stdout.write('\n');
    }

    console.log('\n=====================================================');
    console.log(`[SUCCESS] Finished! Generated ${totalSaved} static slide images.`);
    console.log(`Location: ${OUTPUT_DIR}`);
    console.log('=====================================================');

  } finally {
    cdp.close();
    browserProc.kill();
    server.close();
    // Clean up temp profile
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (_) {}
  }
}

main().catch(err => {
  console.error('[ERROR] Slide export failed:', err);
  process.exit(1);
});
