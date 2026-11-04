import puppeteer from 'puppeteer-core';
import path from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:4321';
const routes = [
  '/',
  '/industrial',
  '/fitness',
  '/productos',
  '/productos/eje-escalonado',
  '/galeria',
  '/nosotros',
  '/contacto',
  '/envios',
  '/privacidad',
  '/404',
];
const widths = [1440, 390];
const axePath = path.resolve('node_modules/axe-core/axe.min.js');

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--disable-gpu'],
});

const page = await browser.newPage();
let total = 0;
const seen = new Set();

for (const route of routes) {
  for (const width of widths) {
    await page.setViewport({ width, height: 900 });
    await page.goto(base + route, { waitUntil: 'networkidle0' });
    await page.addScriptTag({ path: axePath });
    const results = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
        rules: {
          'color-contrast': { enabled: true },
        },
      });
    });

    const serious = results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''));
    if (serious.length) {
      console.log(`\n${route} @ ${width}px — ${serious.length} violación(es)`);
      for (const violation of serious) {
        total += 1;
        const key = `${violation.id}:${violation.nodes[0]?.target?.join(' ')}`;
        if (seen.has(key)) continue;
        seen.add(key);
        console.log(`  [${violation.impact}] ${violation.id}: ${violation.help}`);
        for (const node of violation.nodes.slice(0, 4)) {
          console.log(`    - ${node.target.join(' ')}`);
          console.log(`      ${node.failureSummary?.replace(/\n/g, ' ').slice(0, 240)}`);
        }
      }
    } else {
      console.log(`✓ ${route} @ ${width}px`);
    }
  }
}

console.log(`\n${total} violación(es) seria(s) encontradas.`);
await browser.close();
process.exitCode = total ? 1 : 0;
