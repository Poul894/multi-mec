import { pathToFileURL } from 'node:url';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const html = path.resolve('scripts/og.html');
const output = path.resolve('public/og-multimec.png');

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--allow-file-access-from-files', '--font-render-hinting=none'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(html).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: output, type: 'png' });
  console.log('Generated public/og-multimec.png');
} finally {
  await browser.close();
}
