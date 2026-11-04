import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { createReadStream, statSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const videoPath = path.resolve('video portada.mp4');
const outDir = path.resolve('scripts/_frames');
mkdirSync(outDir, { recursive: true });
const html = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#000">
<video id="v" muted playsinline preload="auto" src="/video.mp4"></video>
</body></html>`;

const server = createServer((req, res) => {
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
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
  const meta = await page.evaluate(() => {
    const video = document.querySelector('#v');
    return new Promise((resolve, reject) => {
      video.addEventListener('loadedmetadata', () => {
        resolve({ duration: video.duration, width: video.videoWidth, height: video.videoHeight });
      }, { once: true });
      video.addEventListener('error', () => reject(new Error('video error')), { once: true });
    });
  });
  console.log('meta', meta);

  const times = [0.4, 3, 6, 9, 12, 15, 18, 21, 24, 27, 29];
  for (const [index, time] of times.entries()) {
    const dataUrl = await page.evaluate(async (time) => {
      const video = document.querySelector('#v');
      await new Promise((resolve, reject) => {
        const done = () => resolve();
        video.addEventListener('seeked', done, { once: true });
        setTimeout(() => reject(new Error('seek timeout')), 8000);
        video.currentTime = Math.min(time, video.duration - 0.05);
      });
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      return canvas.toDataURL('image/png');
    }, time);
    const file = path.join(outDir, `frame-${String(index + 1).padStart(2, '0')}.png`);
    writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log('wrote', file);
  }
} finally {
  await browser.close();
  server.close();
}
