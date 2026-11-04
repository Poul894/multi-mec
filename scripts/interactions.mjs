import puppeteer from 'puppeteer-core';

const base = process.argv[2] ?? 'http://127.0.0.1:4321';
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--disable-gpu'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

let failures = 0;
const check = (condition, label, detail = '') => {
  if (condition) {
    console.log(`✓ ${label}`);
  } else {
    failures += 1;
    console.log(`✗ ${label}${detail ? ` — ${detail}` : ''}`);
  }
};

const visibleCount = (selector) =>
  page.evaluate(
    (sel) => [...document.querySelectorAll(sel)].filter((el) => !el.hidden && el.offsetParent !== null).length,
    selector,
  );

// ---------------------------------------------------------------
// Catálogo: filtros, búsqueda, URL y estado vacío
// ---------------------------------------------------------------
await page.goto(`${base}/productos`, { waitUntil: 'networkidle0' });

check((await visibleCount('.product-card')) === 15, 'Catálogo: muestra las 15 piezas al inicio');

await page.click('[data-filter][data-value="fitness"]');
check((await visibleCount('.product-card')) === 7, 'Catálogo: filtro Fitness muestra 7 piezas');
check(
  await page.$eval('[data-filter][data-value="piezas-a-medida"]', (el) => el.hidden),
  'Catálogo: oculta categorías de otra unidad',
);

await page.click('[data-filter][data-value="bujes"]');
check((await visibleCount('.product-card')) === 1, 'Catálogo: Fitness + Bujes muestra 1 pieza');

await page.type('[data-catalog-search]', 'polea');
check(
  await page.$eval('[data-catalog-empty]', (el) => el.classList.contains('is-visible')),
  'Catálogo: muestra estado vacío sin coincidencias',
);

await page.click('[data-filter][data-value="all"][data-group="category"]');
check((await visibleCount('.product-card')) > 0, 'Catálogo: búsqueda «polea» devuelve resultados');

const url = await page.evaluate(() => window.location.search);
check(url.includes('unidad=fitness') && url.includes('q=polea'), 'Catálogo: sincroniza filtros en la URL', url);

await page.goto(`${base}/productos?unidad=fitness&categoria=bujes`, { waitUntil: 'networkidle0' });
check((await visibleCount('.product-card')) === 1, 'Catálogo: lee unidad y categoría desde la URL');

// ---------------------------------------------------------------
// Galería: filtros + lightbox
// ---------------------------------------------------------------
await page.goto(`${base}/galeria`, { waitUntil: 'networkidle0' });
check((await visibleCount('[data-gallery-item]')) === 9, 'Galería: muestra los 9 trabajos');

await page.click('[data-gallery-filter][data-value="industrial"]');
check((await visibleCount('[data-gallery-item]')) === 5, 'Galería: filtro Industrial muestra 5 trabajos');

await page.click('[data-gallery-open]');
check(await page.$eval('[data-lightbox]', (el) => el.open), 'Galería: abre la imagen ampliada');
const firstTitle = await page.$eval('[data-lightbox-title]', (el) => el.textContent);
check(Boolean(firstTitle), 'Galería: el lightbox muestra un título', firstTitle ?? '');

await page.click('[data-lightbox-next]');
const secondTitle = await page.$eval('[data-lightbox-title]', (el) => el.textContent);
check(secondTitle !== firstTitle, 'Galería: la navegación cambia de imagen');

await page.click('[data-lightbox-close]');
check(!(await page.$eval('[data-lightbox]', (el) => el.open)), 'Galería: cierra el lightbox');

await page.goto(`${base}/galeria?unidad=fitness`, { waitUntil: 'networkidle0' });
check((await visibleCount('[data-gallery-item]')) === 4, 'Galería: lee el filtro desde la URL');

// ---------------------------------------------------------------
// Formulario: precarga desde el catálogo
// ---------------------------------------------------------------
await page.goto(
  `${base}/contacto?pieza=${encodeURIComponent('Buje para máquina de gimnasio')}&unidad=fitness&tipo=${encodeURIComponent('Producción / mayorista')}`,
  { waitUntil: 'networkidle0' },
);

const prefill = await page.evaluate(() => {
  const get = (id) => document.getElementById(id).value;
  return { piece: get('q-piece'), unit: get('q-unit'), type: get('q-type') };
});
check(prefill.piece === 'Buje para máquina de gimnasio', 'Formulario: precarga la pieza', prefill.piece);
check(prefill.unit === 'Multi Mec Fitness', 'Formulario: precarga la unidad', prefill.unit);
check(prefill.type === 'Producción / mayorista', 'Formulario: precarga el tipo de consulta', prefill.type);

// Validación sin datos.
await page.click('form[data-quote-form] button[type="submit"]');
const invalid = await page.evaluate(() => ({
  errors: document.querySelectorAll('.field.has-error').length,
  status: document.querySelector('[data-form-status]')?.classList.contains('is-visible'),
}));
check(invalid.errors >= 3, 'Formulario: marca los campos obligatorios', String(invalid.errors));
check(Boolean(invalid.status), 'Formulario: muestra el aviso de validación');

// Envío con datos: se intercepta window.open.
await page.type('#q-name', 'Prueba Automática');
await page.type('#q-email', 'prueba@example.com');
await page.type('#q-phone', '11 5555 5555');
await page.type('#q-message', 'Consulta de prueba con detalle suficiente para validar el formulario.');
await page.click('input[name="privacy"]');
await page.evaluate(() => {
  window.__opened = '';
  window.open = (url) => {
    window.__opened = String(url);
    return null;
  };
});
await page.click('form[data-quote-form] button[type="submit"]');
const opened = await page.evaluate(() => window.__opened);
check(opened.startsWith('https://wa.me/'), 'Formulario: genera el enlace de WhatsApp', opened.slice(0, 60));
check(opened.includes('Buje%20para%20m%C3%A1quina'), 'Formulario: incluye la pieza en el mensaje');

// ---------------------------------------------------------------
// Menú móvil
// ---------------------------------------------------------------
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: 'networkidle0' });

await page.click('[data-menu-toggle]');
const menuOpen = await page.evaluate(() => ({
  expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'),
  open: document.querySelector('[data-mobile-menu]').classList.contains('is-open'),
  inert: document.querySelector('[data-mobile-menu]').inert,
}));
check(menuOpen.expanded === 'true' && menuOpen.open && !menuOpen.inert, 'Menú móvil: abre correctamente');

await page.keyboard.press('Escape');
const menuClosed = await page.evaluate(() => ({
  expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'),
  open: document.querySelector('[data-mobile-menu]').classList.contains('is-open'),
}));
check(menuClosed.expanded === 'false' && !menuClosed.open, 'Menú móvil: cierra con Escape');

// ---------------------------------------------------------------
// Navegación activa en ficha de producto
// ---------------------------------------------------------------
await page.setViewport({ width: 1280, height: 900 });
await page.goto(`${base}/productos/eje-escalonado`, { waitUntil: 'networkidle0' });
const activeNav = await page.$eval('.nav__link[aria-current="page"]', (el) => el.textContent.trim()).catch(() => '');
check(activeNav === 'Productos', 'Navegación: marca Productos en la ficha', activeNav);

await browser.close();
console.log(failures === 0 ? '\nTodo OK' : `\n${failures} comprobación(es) con error`);
process.exitCode = failures ? 1 : 0;
