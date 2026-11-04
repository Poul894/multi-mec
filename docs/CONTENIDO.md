# Guía de contenido

Todo el contenido comercial vive en `src/data/`. No hace falta tocar componentes ni CSS para actualizar textos, piezas, fotos o contactos.

> **Importante:** los datos marcados como `PROVISIONAL` en el código son de ejemplo. Reemplazalos por información real antes de publicar. El sitio no debe presentar datos inventados como si fueran definitivos.

## 1. Contacto, dominio y redes

Archivo: `src/data/site.ts`

```ts
contact: {
  whatsapp: '5490000000000',        // solo dígitos, formato internacional
  whatsappDisplay: '+54 9 000 000-0000',
  phoneDisplay: '+54 9 000 000-0000',
  email: 'contacto@multimec.com.ar',
  address: '',                      // opcional
  city: '',
  province: '',
  hours: 'Lunes a viernes · 8 a 17 h',
  hoursNote: 'Consultas por WhatsApp dentro y fuera de ese horario.',
}
```

- `whatsapp` alimenta **todos** los botones y el formulario. Debe incluir código de país y área, sin `+`, espacios ni guiones.
- `whatsappDisplay` y `phoneDisplay` son los textos visibles.
- `hoursNote` aclara el horario; si no hay atención fuera de horario, cambialo.
- `site.url` debe coincidir con el dominio real. También hay que actualizar `site` en `astro.config.mjs`.
- Si una red social queda vacía, no se muestra. Para activarla, cargá la URL completa.

Después de cambiar el dominio, regenerá el build para actualizar sitemap y canonical.

## 2. Unidades de negocio

Archivo: `src/data/units.ts`

Cada unidad define nombre, bajada, servicios, acento visual (`orange` o `blue`) y el esquema que la representa. Los textos de las páginas `/industrial` y `/fitness` están en:

- `src/pages/industrial.astro`
- `src/pages/fitness.astro`

Ahí se editan títulos, párrafos, bloques de proceso y llamados a la acción. Los textos compartidos (capacidades, proceso, materiales, sectores, valores y preguntas frecuentes) están en `src/data/content.ts`.

## 3. Catálogo de productos

Archivo: `src/data/products.ts`

Cada producto tiene esta forma:

```ts
{
  slug: 'eje-escalonado',            // URL: /productos/eje-escalonado
  code: 'MM-IND-001',                // código interno visible
  name: 'Eje escalonado',
  unit: 'industrial',                // 'industrial' | 'fitness'
  category: 'Piezas a medida',       // debe coincidir con productCategories
  categorySlug: 'piezas-a-medida',   // debe coincidir con la categoría
  short: 'Resumen para la tarjeta.',
  description: 'Descripción completa para la ficha.',
  applications: ['...'],             // usos / sectores
  specs: [
    { label: 'Material', value: 'Acero 1045' },
    // ...
  ],
  drawing: 'shaft',                  // esquema si no hay foto
  featured: true,                    // opcional: aparece destacado
  image: '/images/productos/eje-escalonado.webp', // opcional
}
```

Reglas para agregar una pieza:

1. El `slug` debe ser único, en minúsculas y sin acentos.
2. `unit` y `categorySlug` deben existir en `productCategories` y pertenecer a la misma unidad.
3. `drawing` debe ser uno de: `shaft`, `bushing`, `pulley`, `wheel`, `roller`, `spacer`, `bar`, `gear`, `flange`, `plate`, `custom`.
4. Si no hay foto, dejá `image` vacío: se muestra un esquema técnico generado por el sitio.
5. Las categorías se crean en `productCategories` con `slug`, `name`, `unit` y `description`.

La búsqueda y los filtros de `/productos` se actualizan solos con los datos. No hay que mantener listas paralelas.

## 4. Galería de trabajos

Archivo: `src/data/works.ts`

```ts
{
  id: 'MM-GAL-001',
  title: 'Eje escalonado a plano',
  unit: 'industrial',
  kind: 'Mecanizado a medida',
  description: 'Texto que aparece en el lightbox.',
  drawing: 'shaft',
  texture: 'grid',        // 'rings' | 'hatch' | 'grid' | 'knurl'
  size: 'wide',           // 'wide' | 'half' | 'third' | 'tall'
  image: '/images/galeria/eje-escalonado.webp', // opcional
}
```

La galería usa el mismo criterio que el catálogo: si hay `image`, muestra la foto; si no, muestra un registro visual técnico. Los filtros por unidad se generan automáticamente.

## 5. Fotos reales

1. Guardá las imágenes en `public/images/productos/` o `public/images/galeria/`.
2. Usá formato WebP o JPG, con nombres en minúsculas y sin espacios.
3. Tamaños recomendados:
   - Productos: **800 × 600 px** (4:3), menos de 150 KB.
   - Galería: **1200 × 900 px** (4:3), menos de 250 KB.
4. Completá el campo `image` con la ruta pública, empezando con `/`:

```ts
image: '/images/productos/eje-escalonado.webp'
```

Las tarjetas usan `alt` con el nombre de la pieza y la galería con el título del trabajo. Si la foto necesita un alt más descriptivo, conviene ampliar el modelo de datos antes de publicar.

Las fotos deben ser propias o estar autorizadas. Evitá imágenes de stock que parezcan piezas fabricadas por Multi Mec.

## 6. Formulario de cotización

Archivo: `src/components/forms/QuoteForm.astro`

- No hay backend: el formulario valida en el navegador y abre WhatsApp con un mensaje formateado.
- El botón secundario abre el cliente de correo con un `mailto:`.
- Se puede precargar desde una ficha de producto con parámetros de URL:
  `/contacto?pieza=Eje%20escalonado&unidad=Industrial&tipo=Repuesto`
- Los campos obligatorios y los mensajes de error están en el mismo componente.

Si se quiere recibir los pedidos por email sin depender de WhatsApp, hay que integrar un servicio externo y reemplazar la función que arma el enlace.

## 7. Preguntas frecuentes y textos legales

- Preguntas frecuentes: `src/data/content.ts` (`faqs`).
- Privacidad: `src/pages/privacidad.astro`.
- Envíos: `src/pages/envios.astro`.
- Datos de la empresa y propuesta de valor: `src/data/content.ts` y `src/pages/nosotros.astro`.

Revisá que las preguntas frecuentes no prometan plazos, tolerancias, precios ni alcances que no estén confirmados.

## 8. SEO y datos sociales

- Título y descripción por página: `BaseLayout.astro` y el frontmatter de cada página.
- Imagen para compartir: `public/og-multimec.png` (1200 × 630). Se regenera con `node scripts/og.mjs`.
- Sitemap: se genera en cada build a partir del dominio de `astro.config.mjs`.
- `robots.txt`: `public/robots.txt`.

## 9. Checklist antes de publicar

- [ ] Número de WhatsApp real y probado desde celular y escritorio.
- [ ] Email real y con casilla activa.
- [ ] Dominio actualizado en `site.ts` y `astro.config.mjs`.
- [ ] Dirección, ciudad y horarios confirmados (o campos vacíos).
- [ ] Redes sociales cargadas o vacías.
- [ ] Productos y categorías revisados: nombres, códigos, materiales y aplicaciones.
- [ ] Fotos reales cargadas y optimizadas.
- [ ] Preguntas frecuentes sin promesas no confirmadas.
- [ ] `npm run build` sin errores.
- [ ] `npm run qa:layout`, `npm run qa:interactions` y `npm run qa:a11y` sin errores.
- [ ] Revisión final en móvil y escritorio.
