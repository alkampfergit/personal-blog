# Agent Instructions

## Repository Purpose

This repository hosts the source for `codewrecks.com`:

- `codewrecks/`: the main English Hugo site
- `itablog/`: the Italian Hugo site, published under `/itablog/`

GitHub Actions builds both sites, copies `itablog/public` into `codewrecks/public/itablog`, and deploys the combined output.

## Repository Layout

- `codewrecks/content/`: English posts and pages
- `itablog/content/`: Italian posts and pages
- `itablog/AGENTS.md`: Italian-site specific instructions; consult it when working inside `itablog/`
- `codewrecks/layouts/`, `itablog/layouts/`: site-level Hugo overrides and custom partials
- `codewrecks/static/`, `itablog/static/`: static assets copied as-is
- `codewrecks/archetypes/`, `itablog/archetypes/`: front matter templates for new content
- `codewrecks/themes/minimo`, `itablog/themes/minimo`: `minimo` theme submodules
- `codewrecks/themes/kiera`: additional theme submodule, not the active site theme
- `.github/workflows/publish.yml`: production build and deploy pipeline
- `.devcontainer/Dockerfile`: local container setup with Hugo installed
- `OldStuff/`: legacy material, not part of the active Hugo build

## Working Rules

- Treat this as a Hugo content repository first, not a generic Node app.
- When working under `itablog/`, also follow the local instructions in `itablog/AGENTS.md`.
- Prefer editing site-level files in `content/`, `layouts/`, `static/`, and `config.toml`.
- Do not edit `themes/minimo` or `themes/kiera` unless the task explicitly requires theme/submodule work.
- Keep English-site changes in `codewrecks/` and Italian-site changes in `itablog/`.
- Preserve base URLs and the `/itablog/` publication path; deployment depends on them.
- Avoid touching `public/`; it is generated output.

## Hugo Version

- Use Hugo Extended.
- CI pins Hugo to `0.148.1` in [publish.yml](/Users/gianmariaricci/develop/github/personal-blog/.github/workflows/publish.yml).
- Prefer the repo-local pinned binary via `./scripts/install-hugo.sh` and `./bin/hugo`.
- A local build with Hugo `0.118.2` fails against the current `minimo` theme with `.Site.Lastmod` errors. If Hugo starts failing in `themes/minimo`, check the Hugo version first before changing templates.

## Local Commands

Install the pinned Hugo release into the repository first if needed:

```bash
./scripts/install-hugo.sh
./bin/hugo version
```

Run commands from the site directory you are working on.

```bash
cd codewrecks
../bin/hugo server -D
../bin/hugo --minify
```

```bash
cd itablog
../bin/hugo server -D
../bin/hugo --minify
```

To reproduce the deploy artifact locally:

```bash
cd codewrecks && ../bin/hugo --minify
cd ../itablog && ../bin/hugo --minify
mkdir -p ../codewrecks/public/itablog
cp -r public/* ../codewrecks/public/itablog/
```

## Content Conventions

- Posts live under `content/post/`; static pages live under `content/page/`.
- English content is organized by topic subfolders under `codewrecks/content/post/`.
- New posts should use front matter with at least:
  - `title`
  - `description`
  - `date`
  - `draft`
  - `tags`
  - `categories`
- The English archetype is minimal, but existing posts usually include `description`, `tags`, and `categories`; keep that consistency.
- The Italian archetype already includes `categories` and `tags`; follow it.
- When creating new posts, prefer the relevant topic folder instead of dumping files at the root of `content/post/`.

## Images And Shortcodes

- Prefer placing article-specific images next to the article content and referencing them with relative paths.
- [render-image.html](/Users/gianmariaricci/develop/github/personal-blog/codewrecks/layouts/_default/_markup/render-image.html) resolves page resources and relative assets, and generates responsive image sizes automatically.
- Reuse existing shortcodes and partials before adding new ones. There is a custom `hidden` shortcode in [hidden.html](/Users/gianmariaricci/develop/github/personal-blog/codewrecks/layouts/shortcodes/hidden.html).

## Layout And Tracking Customizations

- Site-specific overrides exist in `layouts/partials/`, especially for:
  - cookie banner setup
  - Google Analytics / gtag
  - AdSense
  - navigation tweaks
- If behavior differs between English and Italian sites, check both `codewrecks/layouts/partials/` and `itablog/layouts/partials/` before making assumptions.

## Verification

For content-only edits:

- build the affected site with `../bin/hugo --minify`
- if possible, preview with `../bin/hugo server -D`

For shared layout/config changes:

- build both `codewrecks/` and `itablog/`
- verify the Italian site still works under `/itablog/`

If local verification is blocked by an older Hugo binary, report that clearly instead of patching templates blindly.

## Tests

The repository uses **Playwright** for browser-based integration tests. Tests currently cover the Italian site (`itablog/`) only.

### Structure

```
itablog/
├── playwright.config.js      # Playwright configuration
├── package.json               # test scripts and @playwright/test dependency
└── tests/
    ├── cookie-consent.spec.js # Cookie consent & Google Analytics tests (11 cases)
    └── README.md              # Detailed test documentation
```

### Running Tests

```bash
cd itablog
npm test                  # headless
npm run test:headed       # with browser visible
npx playwright test --reporter=list   # verbose output
```

Playwright automatically starts a Hugo dev server on port 1314 (`../bin/hugo server -D --port 1314`). If one is already running it will reuse it. The browser used is **webkit**.

### What Is Tested

The `cookie-consent.spec.js` file verifies:

- Consent banner appears on first visit
- Google Analytics (`gtag.js`) is **not** loaded before consent
- Declining cookies hides the banner, sets `cookie_consent=declined`, and keeps GA blocked (including after reload and navigation)
- Accepting cookies hides the banner, sets `cookie_consent=accepted`, and loads GA (including after reload and navigation)
- No duplicate GA script elements are created

### Prerequisites

- Node.js v18+, Hugo binary at `../bin/hugo`
- One-time setup: `npm install && npx playwright install webkit`

### CI Note

Tests are **not** currently part of the GitHub Actions pipeline (`publish.yml`). They run locally only.

## Deployment Notes

- Production deploy is triggered by pushes to `master`.
- The published site comes from `codewrecks/public`, with the Italian site copied into `codewrecks/public/itablog`.
- Changes that affect only `itablog/` still matter to the final deploy artifact because they are merged into the English site output during CI.
