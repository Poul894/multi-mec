// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// IMPORTANTE: reemplazar por el dominio definitivo antes de publicar.
export default defineConfig({
  site: 'https://www.multimec.com.ar',
  trailingSlash: 'ignore',
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  build: {
    inlineStylesheets: 'auto',
  },
  // El sitio sigue siendo estático por defecto: el adapter solo habilita
  // las rutas puntuales marcadas con `export const prerender = false`
  // (panel /admin, endpoints /api y /presupuesto/[id]).
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin') && !page.includes('/presupuesto/'),
    }),
  ],
});
