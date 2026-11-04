// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  integrations: [sitemap()],
});
