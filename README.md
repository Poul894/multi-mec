# Multi Mec

Sitio web de **Multi Mec**, tornería y mecanizado de precisión en Argentina. Presenta dos unidades de negocio:

- **Multi Mec Industrial** — piezas a medida, repuestos y mecanizado según plano o muestra.
- **Multi Mec Fitness** — componentes y repuestos para fabricantes de equipamiento de gimnasio.

El sitio es estático, rápido y sin dependencias de servidor. El objetivo principal es que un cliente pueda **pedir una cotización por WhatsApp** desde cualquier página.

## Stack

- [Astro](https://docs.astro.build) 7 (salida estática)
- CSS propio con design tokens (sin framework de estilos)
- Tipografías locales: Archivo Variable y JetBrains Mono
- `@astrojs/sitemap` para el sitemap
- Sharp y Puppeteer solo para generar íconos e imagen Open Graph

## Requisitos

- Node.js **22.23.4 o superior**
- npm

## Puesta en marcha

```bash
npm install
npm run dev
```

El servidor de desarrollo queda en `http://localhost:4321`.

```bash
npm run build     # genera el sitio en dist/
npm run preview   # sirve dist/ en http://localhost:4321
```

Para publicar, subí el contenido de `dist/` a cualquier hosting estático (Netlify, Vercel, Cloudflare Pages, hosting tradicional, etc.).

## Antes de publicar

El sitio funciona, pero algunos datos comerciales son **provisionales**. Hay que reemplazarlos sí o sí:

1. **Contacto y dominio** en `src/data/site.ts`:
   - `contact.whatsapp`: número real en formato internacional, sin `+` ni espacios (ej. `5491123456789`).
   - `contact.whatsappDisplay`, `contact.phoneDisplay`, `contact.email`, `contact.hours`.
   - `contact.address`, `city`, `province` si se quiere mostrar la ubicación.
   - `social.*` con las URLs reales.
   - `site.url` con el dominio definitivo.
2. **Dominio en `astro.config.mjs`** (`site`). Se usa para el sitemap y las URLs canónicas.
3. **Contenido del catálogo, galería y textos**: ver [`docs/CONTENIDO.md`](docs/CONTENIDO.md).
4. **Imágenes reales**: reemplazar los esquemas técnicos por fotos cuando estén disponibles.

El formulario de cotización **no envía correos por sí solo**: valida los datos en el navegador y abre WhatsApp con el mensaje armado. También ofrece un enlace `mailto:` como alternativa. Si más adelante se quiere un envío real por email, hay que conectar un servicio externo (Formspree, Resend, etc.).

## Estructura

```text
src/
├── components/       Componentes reutilizables (layout, UI, catálogo, galería, formulario)
├── data/             Contenido editable: sitio, unidades, productos, trabajos, textos
├── layouts/          BaseLayout con SEO, header, footer y WhatsApp flotante
├── pages/            Rutas del sitio
├── styles/           Tokens, base, componentes y estilos de páginas
└── assets/           Recursos procesados por Astro
public/               Íconos, manifest, robots.txt, imagen OG
scripts/              Auditorías de QA y generación de assets
```

### Rutas principales

| Ruta | Contenido |
| --- | --- |
| `/` | Home con presentación y acceso a las dos unidades |
| `/industrial` | Unidad Industrial |
| `/fitness` | Unidad Fitness |
| `/productos` | Catálogo con búsqueda y filtros |
| `/productos/[slug]` | Ficha técnica de cada pieza |
| `/galeria` | Galería de trabajos con lightbox |
| `/nosotros` | Empresa, proceso y capacidades |
| `/contacto` | Formulario de cotización y datos de contacto |
| `/envios` | Envíos y coordinación logística |
| `/privacidad` | Política de privacidad |

## QA

Con el sitio compilado y `npm run preview` corriendo en `http://127.0.0.1:4321`:

```bash
npm run qa:layout        # overflow y layout en 12 rutas × 4 anchos
npm run qa:interactions  # filtros, búsqueda, galería, formulario y menú móvil
npm run qa:a11y          # accesibilidad con axe-core a 1440 px y 390 px
```

Resultado esperado: las tres auditorías terminan sin errores.

## Assets

```bash
node scripts/assets.mjs   # regenera favicon.ico, apple-touch-icon e íconos PNG
node scripts/og.mjs       # regenera public/og-multimec.png (requiere Chrome instalado)
```

El script `og.mjs` usa la ruta de Chrome configurada al inicio del archivo. Si Chrome está en otra ubicación, actualizá `chromePath`.

## SEO

- Títulos, descripciones, canonical y Open Graph por página en `BaseLayout.astro`.
- Datos estructurados `Organization`, `WebSite` y `Product` (fichas).
- `sitemap-index.xml` y `robots.txt` generados en el build.
- La imagen social por defecto es `public/og-multimec.png` (1200 × 630).

## Créditos

Diseño y desarrollo a medida para Multi Mec. Las tipografías se distribuyen mediante Fontsource con sus licencias correspondientes.
