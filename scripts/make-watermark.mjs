// Genera public/logo-watermark.png: una versión del ícono con fondo
// transparente (alfa = luminancia), pensada para usarse como marca de
// agua muy tenue en los PDF (presupuestos/remitos). Correr con:
//   node scripts/make-watermark.mjs
import sharp from 'sharp';

const SRC = 'public/icon-512.png';
const OUT = 'public/logo-watermark.png';
// Gris azulado oscuro: a opacidad baja se lee como una marca de agua
// neutra sobre papel blanco, sin competir con el texto.
const COLOR = [31, 41, 56];

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.alloc(width * height * 4);

for (let i = 0; i < width * height; i += 1) {
  const srcIdx = i * channels;
  const r = data[srcIdx];
  const g = data[srcIdx + 1];
  const b = data[srcIdx + 2];
  const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;

  const dstIdx = i * 4;
  out[dstIdx] = COLOR[0];
  out[dstIdx + 1] = COLOR[1];
  out[dstIdx + 2] = COLOR[2];
  out[dstIdx + 3] = Math.round(Math.min(255, luminancia));
}

await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(OUT);
console.log(`Generado ${OUT}`);
