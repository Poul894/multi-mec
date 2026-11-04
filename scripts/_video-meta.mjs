import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import path from 'node:path';

const videoPath = path.resolve('video portada.mp4');
const html = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#000">
<video id="v" muted playsinline preload="auto" src="/video.mp4"></video>
</body></html>`;

const server = createServer((req, res) => {
  console.log('[req]', req.method, req.url, req.headers.range || '');
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }
  if (req.url === '/video.mp4') {
    const stat = statSync(videoPath);
    const range = req.headers.range;
    if (range) {
      const [startRaw, endRaw] = range.replace(/bytes=/, '').split('-');
      const start = Number(startRaw);
      const end = endRaw ? Number(endRaw) : stat.size - 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': 'video/mp4',
      });
      createReadStream(videoPath, { start, end }).pipe(res);
      return;
    }
    res.writeHead(200, {
      'Content-Length': stat.size,
      'Accept-Ranges': 'bytes',
      'Content-Type': 'video/mp4',
    });
    createReadStream(videoPath).pipe(res);
    return;
  }
  res.writeHead(404).end();
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--autoplay-policy=no-user-gesture-required'],
});

try {
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('[browser]', msg.text()));
  page.on('pageerror', (err) => console.log('[pageerror]', err.message));
  page.on('requestfailed', (req) => console.log('[failed]', req.url(), req.failure()?.errorText));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const state = await page.evaluate(() => {
    const video = document.querySelector('#v');
    return {
      readyState: video.readyState,
      networkState: video.networkState,
      error: video.error ? { code: video.error.code, message: video.error.message } : null,
      duration: video.duration,
      width: video.videoWidth,
      height: video.videoHeight,
      src: video.currentSrc,
      canPlayH264: video.canPlayType('video/mp4; codecs="avc1.42E01E"'),
      canPlayWebm: video.canPlayType('video/webm; codecs="vp9"'),
    };
  });
  console.log(JSON.stringify(state, null, 2));
} finally {
  await browser.close();
  server.close();
}
