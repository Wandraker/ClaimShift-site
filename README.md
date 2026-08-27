# ClaimShift Site

Official static website and administrator wiki for ClaimShift.

Built with React, TypeScript and Vite. The site has no authentication, database or backend and is intended for GitHub Pages.

## Pages

- `/` — public project overview
- `/wiki/` — detailed administrator documentation

Both pages include native English and Russian content. The selected language is stored locally in the browser.

## Local development

Requirements:

- Node.js 22+
- npm

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

The generated site is written to `dist/`.

## GitHub Pages

The included `.github/workflows/deploy-pages.yml` workflow builds and publishes the site on pushes to `main`.

In GitHub open:

`Settings -> Pages -> Build and deployment -> Source`

and select **GitHub Actions**.

## bStats

The website reads ClaimShift's public bStats charts through the read-only REST API. The ClaimShift plugin ID defaults to `33671` and can still be overridden with:

```env
VITE_BSTATS_PLUGIN_ID=33671
```

## Project links

Public project links are centralized in `src/site-config.ts`.

## License

The website, its design and its original content are proprietary material.

Copyright © 2026 Onelsey. All rights reserved.

See `LICENSE` for the complete terms.
