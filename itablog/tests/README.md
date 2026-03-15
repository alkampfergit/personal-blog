# Cookie Consent Tests

Automated Playwright tests that verify the EU cookie consent implementation works correctly:
no tracking scripts (Google Analytics, AdSense) are loaded until the user explicitly accepts cookies.

## What is tested

| Scenario | Expected behavior |
|----------|-------------------|
| First visit (no cookie) | Consent banner is visible, GA is **not** loaded |
| User clicks "Rifiuta" (decline) | Banner disappears, `cookie_consent=declined` cookie set, GA **not** loaded |
| Reload after decline | Banner stays hidden, GA still **not** loaded |
| Navigate to another page after decline | No banner, no GA |
| User clicks "Accetta" (accept) | Banner disappears, `cookie_consent=accepted` cookie set, GA **is** loaded |
| Reload after accept | Banner stays hidden, GA loaded automatically |
| Navigate to another page after accept | GA loaded automatically |
| Double-load prevention | Only one `#gtag-script` element exists even after multiple page loads |

## Prerequisites

- **Node.js** (v18+)
- **Hugo** — the pinned binary at `../bin/hugo` (install with `../scripts/install-hugo.sh` if needed)

## Setup (one time)

```bash
cd itablog
npm install
npx playwright install chromium
```

## Running the tests

The Playwright config automatically starts a Hugo dev server on port 1314. If one is already running, it will reuse it.

```bash
# Run all tests (headless)
cd itablog
npm test

# Run with browser visible
npm run test:headed

# Run a specific test file
npx playwright test tests/cookie-consent.spec.js

# Run with verbose output
npx playwright test --reporter=list
```

## How it works

The tests use Playwright to:

1. **Clear cookies** before each test (clean state)
2. **Navigate** to the Italian blog
3. **Assert** banner visibility, cookie values, and whether the GA script element (`#gtag-script`) and `window.gtag` function exist
4. **Intercept network requests** to verify that `googletagmanager.com` is only contacted after the user accepts

The Hugo dev server runs on `http://localhost:1314/itablog/`. On localhost, the actual GA request will fail (no internet access to Google in CI), but the test verifies that the **request was attempted** (accept flow) or **never made** (decline/no-consent flow).

## Troubleshooting

- **Port 1314 already in use**: Stop any running Hugo server (`pkill -f "hugo server"`) or let Playwright reuse it
- **Hugo not found**: Run `../scripts/install-hugo.sh` from the repo root
- **Browser not installed**: Run `npx playwright install chromium`
