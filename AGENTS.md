## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project notes

- This is a static Astro site. Content is edited in `src/data/`; see `docs/CONTENIDO.md`.
- Contact details and the site URL are provisional in `src/data/site.ts` and `astro.config.mjs`.
- Use Spanish rioplatense in visible copy ("Solicitá", "Contanos", "Elegí").
- Rebuild with `npm run build` before running the QA scripts; they test the preview at `http://127.0.0.1:4321`.
- Run `npm run qa:layout`, `npm run qa:interactions` and `npm run qa:a11y` after layout or interaction changes.
- Catalogue and gallery images are optional: when `image` is empty, the site renders its own technical SVG visual. Do not replace those visuals with stock photos.

