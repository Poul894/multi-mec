import puppeteer from 'puppeteer-core';

const url = process.argv[2] ?? 'http://127.0.0.1:4321/';
const out = process.argv[3] ?? 'shot.png';
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 1000);
const fullPage = process.argv[6] !== 'viewport';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu', '--font-render-hinting=none'],
});

const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise((resolve) => setTimeout(resolve, 600));
await page.evaluate(() => {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
});
await new Promise((resolve) => setTimeout(resolve, 400));
await page.screenshot({ path: out, fullPage });
await browser.close();
console.log(`Saved ${out}`);
