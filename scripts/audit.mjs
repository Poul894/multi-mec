import puppeteer from 'puppeteer-core';

const url = process.argv[2] ?? 'http://127.0.0.1:4321/';
const widths = [1440, 1280, 1024, 768, 390, 360];

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
});

const page = await browser.newPage();

for (const width of widths) {
  await page.setViewport({ width, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  const data = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const overflowing = [...document.querySelectorAll('body *')]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          cls: (el.getAttribute('class') ?? '').slice(0, 60),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          text: (el.textContent ?? '').trim().slice(0, 40),
        };
      })
      .filter((item) => item.width > 0 && (item.right > vw + 1 || item.left < -1))
      .slice(0, 12);
    const headings = [...document.querySelectorAll('h1,h2,h3')].map((h) => `${h.tagName}: ${h.textContent.trim().slice(0, 60)}`);
    return {
      vw,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      h1count: document.querySelectorAll('h1').length,
      headings: headings.slice(0, 12),
      overflowing,
    };
  });
  console.log(`\n=== ${width}px ===`);
  console.log(JSON.stringify(data, null, 2));
}

await browser.close();
