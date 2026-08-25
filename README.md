# ClaimShift Site

Official static website for ClaimShift.

Built with React, TypeScript and Vite. The repository is designed for deployment through GitHub Pages and contains no authentication, database, backend or server-side application code.

## Local development

Requirements:

- Node.js 22+
- npm

Install dependencies and start Vite:

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

The included workflow `.github/workflows/deploy-pages.yml` builds and publishes the site automatically on pushes to `main`.

In the GitHub repository open:

`Settings -> Pages -> Build and deployment -> Source`

and select **GitHub Actions**.

The Vite base path is configured for the repository name `ClaimShift-site` when GitHub Actions builds the project.

## Links

Public project links are centralized in `src/site-config.ts`.

## bStats

The statistics section supports the public, read-only bStats REST API.

Set the bStats plugin ID with either:

```env
VITE_BSTATS_PLUGIN_ID=12345
```

or edit the fallback value in `src/site-config.ts`.

If no ID is configured, the site remains fully functional and shows a neutral waiting state instead of failing.

## License

The website is proprietary source-available material.

Copyright © 2026 Onelsey. All rights reserved.

See `LICENSE` for the complete terms.
