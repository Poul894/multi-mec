import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const source = await readFile(path.join(publicDir, 'favicon.svg'));

const renderPng = (size) => sharp(source, { density: 384 }).resize(size, size).png().toBuffer();

const png32 = await renderPng(32);
const png48 = await renderPng(48);
const png180 = await renderPng(180);
const png192 = await renderPng(192);
const png512 = await renderPng(512);

await writeFile(path.join(publicDir, 'apple-touch-icon.png'), png180);
await writeFile(path.join(publicDir, 'icon-192.png'), png192);
await writeFile(path.join(publicDir, 'icon-512.png'), png512);

/** Build a multi-size .ico containing PNG payloads (supported by modern browsers). */
function createIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const entries = [];
  let offset = 6 + images.length * 16;

  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

await writeFile(
  path.join(publicDir, 'favicon.ico'),
  createIco([
    { size: 32, data: png32 },
    { size: 48, data: png48 },
  ]),
);

console.log('Generated favicon.ico, apple-touch-icon.png, icon-192.png and icon-512.png');
