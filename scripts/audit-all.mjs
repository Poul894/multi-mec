import puppeteer from 'puppeteer-core';

const base = process.argv[2] ?? 'http://127.0.0.1:4321';
const routes = [
  '/',
  '/industrial',
  '/fitness',
  '/productos',
  '/productos/eje-escalonado',
  '/productos/buje-fitness',
  '/galeria',
  '/nosotros',
  '/contacto',
  '/envios',
  '/privacidad',
  '/404',
];
const widths = [1440, 1024, 768, 390];

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
});

const page = await browser.newPage();
const problems = [];

for (const route of routes) {
  for (const width of widths) {
    const errors = [];
    const onConsole = (message) => {
      if (message.type() === 'error') errors.push(`console: ${message.text().slice(0, 180)}`);
    };
    const onPageError = (error) => errors.push(`pageerror: ${error.message.slice(0, 180)}`);
    page.on('console', onConsole);
    page.on('pageerror', onPageError);

    await page.setViewport({ width, height: 900 });
    const response = await page.goto(base + route, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    // Dispara las animaciones de scroll para medir el layout final.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      window.scrollTo(0, 0);
    });

    const data = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const tolerante = [...document.querySelectorAll('body *')]
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName.toLowerCase(),
            cls: (el.getAttribute('class') ?? '').slice(0, 50),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          };
        })
        .filter((item) => item.width > 0 && (item.right > vw + 1 || item.left < -1))
        .slice(0, 8);

      return {
        title: document.title,
        h1: document.querySelectorAll('h1').length,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: vw,
        height: document.documentElement.scrollHeight,
        brokenImages: [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.getAttribute('src')),
        overflowing: tolerante,
        lang: document.documentElement.lang,
      };
    });

    page.off('console', onConsole);
    page.off('pageerror', onPageError);

    const status = response?.status();
    const overflow = data.scrollWidth > data.clientWidth + 1;
    const issues = [];
    if (status !== 200 && status !== 304 && !(route === '/404' && status === 404)) issues.push(`status ${status}`);
    if (data.h1 !== 1) issues.push(`h1=${data.h1}`);
    if (overflow) issues.push(`overflow ${data.scrollWidth}>${data.clientWidth}`);
    if (data.brokenImages.length) issues.push(`images ${data.brokenImages.join(',')}`);
    if (errors.length) issues.push(...errors);

    if (issues.length) {
      problems.push({ route, width, issues, overflowing: data.overflowing });
      console.log(`✗ ${width}px ${route} — ${issues.join(' | ')}`);
    } else {
      console.log(`✓ ${width}px ${route}`);
    }
  }
}

if (problems.length) {
  console.log('\nDetalle de overflow:');
  console.log(JSON.stringify(problems.filter((item) => item.overflowing.length), null, 2));
}

await browser.close();
process.exitCode = problems.length ? 1 : 0;
