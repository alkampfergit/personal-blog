// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test('renderizza il widget copertina nella pagina esempio', async ({ page }) => {
  await page.goto('./post/general/esempio-copertina/');
  await page.locator('#cookie-decline').click();

  const widget = page.locator('[data-testid="cover-widget"]');
  await expect(widget).toBeVisible();
  await expect(widget.locator('.cover-widget-title')).toContainText('copertina editoriale');
  await expect(widget.locator('.cover-widget-detail')).toContainText('foto inclinata e bordo bianco');

  const image = widget.locator('[data-testid="cover-widget-image"]');
  await expect(image).toBeVisible();

  const imageSrc = await image.getAttribute('src');
  expect(imageSrc).toContain('/post/general/esempio-copertina/images/catcyber.jpg');

  const frameStyle = await widget.locator('.cover-widget-photo-frame').evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      transform: style.transform,
      borderTopColor: style.borderTopColor,
      borderTopWidth: style.borderTopWidth,
    };
  });

  expect(frameStyle.transform).not.toBe('none');
  expect(frameStyle.borderTopColor).toBe('rgb(255, 255, 255)');
  expect(parseFloat(frameStyle.borderTopWidth)).toBeGreaterThan(0);
});
