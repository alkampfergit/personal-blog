// @ts-check
const { test, expect } = require('@playwright/test');

// Helper: clear the consent cookie before each test
test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test.describe('Cookie Consent Banner', () => {

  test('shows consent banner on first visit', async ({ page }) => {
    await page.goto('./');

    const banner = page.locator('#cookie-consent-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText('Questo sito utilizza i cookie');
    await expect(page.locator('#cookie-accept')).toBeVisible();
    await expect(page.locator('#cookie-decline')).toBeVisible();
  });

  test('does not load Google Analytics before consent', async ({ page }) => {
    // Intercept all requests to track GA calls
    const gaRequests = [];
    page.on('request', (req) => {
      if (req.url().includes('googletagmanager.com') || req.url().includes('google-analytics.com')) {
        gaRequests.push(req.url());
      }
    });

    await page.goto('./');
    // Wait a bit for any deferred scripts
    await page.waitForTimeout(1000);

    expect(gaRequests).toHaveLength(0);

    // Also verify no gtag script element exists
    const gtagExists = await page.evaluate(() => !!document.getElementById('gtag-script'));
    expect(gtagExists).toBe(false);

    // And no gtag function
    const gtagType = await page.evaluate(() => typeof window.gtag);
    expect(gtagType).toBe('undefined');
  });

});

test.describe('Cookie Consent - Decline', () => {

  test('clicking Rifiuta hides banner and sets declined cookie', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('#cookie-consent-banner')).toBeVisible();

    await page.locator('#cookie-decline').click();

    // Banner should disappear
    await expect(page.locator('#cookie-consent-banner')).not.toBeVisible();

    // Cookie should be set to declined
    const cookies = await page.context().cookies();
    const consent = cookies.find((c) => c.name === 'cookie_consent');
    expect(consent).toBeTruthy();
    expect(consent.value).toBe('declined');
  });

  test('after decline, GA is not loaded', async ({ page }) => {
    await page.goto('./');
    await page.locator('#cookie-decline').click();

    const gtagExists = await page.evaluate(() => !!document.getElementById('gtag-script'));
    expect(gtagExists).toBe(false);
  });

  test('after decline, reload does not show banner and does not load GA', async ({ page }) => {
    await page.goto('./');
    await page.locator('#cookie-decline').click();

    // Reload
    await page.reload();

    // Banner should remain hidden (display:none)
    const bannerDisplay = await page.evaluate(() => {
      const b = document.getElementById('cookie-consent-banner');
      return b ? window.getComputedStyle(b).display : 'removed';
    });
    expect(bannerDisplay).toBe('none');

    // No GA
    const gtagExists = await page.evaluate(() => !!document.getElementById('gtag-script'));
    expect(gtagExists).toBe(false);
  });

  test('after decline, navigating to another page does not load GA', async ({ page }) => {
    await page.goto('./');
    await page.locator('#cookie-decline').click();

    // Navigate to a different page
    await page.goto('./post/benvenuto/');

    const gtagExists = await page.evaluate(() => !!document.getElementById('gtag-script'));
    expect(gtagExists).toBe(false);

    const bannerDisplay = await page.evaluate(() => {
      const b = document.getElementById('cookie-consent-banner');
      return b ? window.getComputedStyle(b).display : 'removed';
    });
    expect(bannerDisplay).toBe('none');
  });

});

test.describe('Cookie Consent - Accept', () => {

  test('clicking Accetta hides banner and sets accepted cookie', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('#cookie-consent-banner')).toBeVisible();

    await page.locator('#cookie-accept').click();

    // Banner should disappear
    await expect(page.locator('#cookie-consent-banner')).not.toBeVisible();

    // Cookie should be set to accepted
    const cookies = await page.context().cookies();
    const consent = cookies.find((c) => c.name === 'cookie_consent');
    expect(consent).toBeTruthy();
    expect(consent.value).toBe('accepted');
  });

  test('after accept, GA script is loaded', async ({ page }) => {
    const gaRequests = [];
    page.on('request', (req) => {
      if (req.url().includes('googletagmanager.com')) {
        gaRequests.push(req.url());
      }
    });

    await page.goto('./');
    await page.locator('#cookie-accept').click();

    // Wait for the script to be injected
    await page.waitForTimeout(1000);

    // gtag script element should exist
    const gtagExists = await page.evaluate(() => !!document.getElementById('gtag-script'));
    expect(gtagExists).toBe(true);

    // gtag function should be defined
    const gtagType = await page.evaluate(() => typeof window.gtag);
    expect(gtagType).toBe('function');

    // A request to googletagmanager should have been made
    expect(gaRequests.length).toBeGreaterThan(0);
  });

  test('after accept, reload auto-loads GA without showing banner', async ({ page }) => {
    await page.goto('./');
    await page.locator('#cookie-accept').click();

    // Track GA requests on reload
    const gaRequests = [];
    page.on('request', (req) => {
      if (req.url().includes('googletagmanager.com')) {
        gaRequests.push(req.url());
      }
    });

    await page.reload();
    await page.waitForTimeout(1000);

    // Banner hidden
    const bannerDisplay = await page.evaluate(() => {
      const b = document.getElementById('cookie-consent-banner');
      return b ? window.getComputedStyle(b).display : 'removed';
    });
    expect(bannerDisplay).toBe('none');

    // GA loaded
    const gtagExists = await page.evaluate(() => !!document.getElementById('gtag-script'));
    expect(gtagExists).toBe(true);

    expect(gaRequests.length).toBeGreaterThan(0);
  });

  test('after accept, navigating to another page loads GA', async ({ page }) => {
    await page.goto('./');
    await page.locator('#cookie-accept').click();

    await page.goto('./post/benvenuto/');
    await page.waitForTimeout(500);

    const gtagExists = await page.evaluate(() => !!document.getElementById('gtag-script'));
    expect(gtagExists).toBe(true);
  });

});

test.describe('AdSense Consent - Before consent', () => {

  test('does not load AdSense before consent', async ({ page }) => {
    const adRequests = [];
    page.on('request', (req) => {
      if (req.url().includes('pagead2.googlesyndication.com') || req.url().includes('adsbygoogle')) {
        adRequests.push(req.url());
      }
    });

    await page.goto('./');
    await page.waitForTimeout(1000);

    expect(adRequests).toHaveLength(0);

    const adsenseExists = await page.evaluate(() => !!document.getElementById('adsense-script'));
    expect(adsenseExists).toBe(false);
  });

});

test.describe('AdSense Consent - Decline', () => {

  test('after decline, AdSense is not loaded', async ({ page }) => {
    await page.goto('./');
    await page.locator('#cookie-decline').click();

    const adsenseExists = await page.evaluate(() => !!document.getElementById('adsense-script'));
    expect(adsenseExists).toBe(false);
  });

  test('after decline, reload does not load AdSense', async ({ page }) => {
    await page.goto('./');
    await page.locator('#cookie-decline').click();
    await page.reload();

    const adsenseExists = await page.evaluate(() => !!document.getElementById('adsense-script'));
    expect(adsenseExists).toBe(false);
  });

});

test.describe('AdSense Consent - Accept', () => {

  test('after accept, AdSense script is loaded', async ({ page }) => {
    const adRequests = [];
    page.on('request', (req) => {
      if (req.url().includes('pagead2.googlesyndication.com')) {
        adRequests.push(req.url());
      }
    });

    await page.goto('./');
    await page.locator('#cookie-accept').click();
    await page.waitForTimeout(1000);

    const adsenseExists = await page.evaluate(() => !!document.getElementById('adsense-script'));
    expect(adsenseExists).toBe(true);

    expect(adRequests.length).toBeGreaterThan(0);
  });

  test('after accept, reload auto-loads AdSense', async ({ page }) => {
    await page.goto('./');
    await page.locator('#cookie-accept').click();

    const adRequests = [];
    page.on('request', (req) => {
      if (req.url().includes('pagead2.googlesyndication.com')) {
        adRequests.push(req.url());
      }
    });

    await page.reload();
    await page.waitForTimeout(1000);

    const adsenseExists = await page.evaluate(() => !!document.getElementById('adsense-script'));
    expect(adsenseExists).toBe(true);

    expect(adRequests.length).toBeGreaterThan(0);
  });

});

test.describe('Cookie Consent - No double loading', () => {

  test('accepting twice does not create duplicate GA scripts', async ({ page }) => {
    // Set accepted cookie manually, then load
    await page.context().addCookies([{
      name: 'cookie_consent',
      value: 'accepted',
      url: 'http://localhost:1314',
    }]);

    await page.goto('./');
    await page.waitForTimeout(1000);

    // Count gtag script elements
    const gtagCount = await page.evaluate(() =>
      document.querySelectorAll('#gtag-script').length
    );
    expect(gtagCount).toBe(1);
  });

  test('accepting twice does not create duplicate AdSense scripts', async ({ page }) => {
    await page.context().addCookies([{
      name: 'cookie_consent',
      value: 'accepted',
      url: 'http://localhost:1314',
    }]);

    await page.goto('./');
    await page.waitForTimeout(1000);

    const adsenseCount = await page.evaluate(() =>
      document.querySelectorAll('#adsense-script').length
    );
    expect(adsenseCount).toBe(1);
  });

});
