import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const html = path.resolve('scripts/carta-presentacion.html');
const output = path.resolve('public/docs/carta-presentacion-multimec.pdf');

fs.mkdirSync(path.dirname(output), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--allow-file-access-from-files', '--font-render-hinting=none'],
});

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: output,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  console.log('Generated public/docs/carta-presentacion-multimec.pdf');
} finally {
  await browser.close();
}
