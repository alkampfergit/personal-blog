# Italian Site Instructions

## Purpose

This directory contains the Italian Hugo site published at `https://www.codewrecks.com/itablog/`.

It is a standalone Hugo site with site-level templates and assets. It does **not** use the `minimo` theme as its active rendering path, even though a `themes/` directory may exist in the tree.

## Active Structure

- `config.toml`: Italian-site configuration, menus, taxonomies, and base URL
- `content/post/`: Italian blog posts
- `content/page/`: standalone pages such as privacy and about
- `layouts/_default/`: active page templates
- `layouts/index.html`: custom homepage template
- `layouts/partials/head/extra.html`: site config bootstrap for consent/tracking scripts
- `layouts/partials/footer/extra.html`: cookie banner markup
- `static/css/site.css`: main site stylesheet
- `static/js/cookie-consent.js`: cookie consent and conditional tracking loader
- `tests/`: Playwright coverage for cookie consent behavior

## Working Rules

- Treat `itablog/` as a custom Hugo site, not as a theme-based clone of `codewrecks/`.
- Prefer changing `content/`, `layouts/`, `static/`, and `config.toml`.
- Do not reintroduce the old `_gv_base`, widget, or theme-partial structure unless the task explicitly requires a theme migration.
- Keep the site single-language unless the task explicitly asks for multilingual support.
- Preserve the `/itablog/` base path in links, assets, and generated output.
- Avoid editing `public/`; it is generated output.

## Content Conventions

- Blog posts belong in `content/post/`.
- Standalone pages belong in `content/page/`.
- New posts should keep front matter consistent with the archetype:
  - `title`
  - `date`
  - `draft`
  - `categories`
  - `tags`
  - `description` when useful for listing/meta output
- The homepage article list is intended to show posts only, not generic pages.

## Layout Conventions

- Shared visual styling should live in `static/css/site.css`, not inline in templates.
- Shared client-side behavior should live in `static/js/`, not embedded as large inline scripts.
- If you need page-specific markup for tracking or consent, keep it minimal in partials and put reusable logic in static assets.
- The cookie banner and consent logic are part of the active site behavior; preserve the current opt-in loading model for Analytics and AdSense unless explicitly asked to change it.

## Verification

For content-only changes:

```bash
cd itablog
../bin/hugo --minify
```

For layout, config, or consent-script changes:

```bash
cd itablog
../bin/hugo --minify
npm test
```

If a local Hugo server is already running, be aware it can rewrite `public/` with `localhost` URLs and live-reload scripts. Prefer validating production output with `../bin/hugo --minify`.
