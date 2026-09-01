import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFoundationStyles } from '../../../testing/fixtures/foundation-styles.mjs';

const fixture = `
  <main class="dui-container" data-dui-container data-padding="page" data-size="xl">
    <h1 class="dui-heading" data-dui-heading data-level="1">Account settings</h1>
    <form class="dui-stack" data-dui-stack data-gap="md">
      <div class="dui-field" data-dui-field>
        <label class="dui-field-label" for="email">Email</label>
        <input class="dui-control" data-dui-control id="email" type="email" aria-describedby="email-help" />
        <div class="dui-field-message dui-field-message-description" id="email-help">Use a work address.</div>
      </div>
      <button class="dui-button" data-dui-button data-size="md" data-tone="primary" data-variant="solid" type="submit">Save changes</button>
    </form>
    <div class="dui-grid" data-dui-grid data-columns="expanded" data-gap="md">
      <div class="dui-card" data-dui-card><h2>Usage</h2><div class="dui-stat" data-dui-stat><div class="dui-stat-label">Projects</div><div class="dui-stat-value">42</div></div></div>
      <div class="dui-empty-state" data-dui-empty-state><h2>No alerts</h2><p>Everything is up to date.</p></div>
    </div>
  </main>
`;

async function loadFixture(page: Page) {
  const styles = await readFoundationStyles({ includePrimitives: true, includeComponents: true });
  await page.setContent(
    `<!doctype html><html lang="en" data-theme="dark" data-density="comfortable"><head><title>Basic controls</title></head><body>${fixture}</body></html>`,
  );
  await page.addStyleTag({ content: styles });
}

test.describe('Depo UI basic component browser contract', () => {
  test('keeps form controls usable at narrow width and in touch density', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await loadFixture(page);
    const width = await page.locator('main').evaluate((element) => element.scrollWidth);
    expect(width).toBeLessThanOrEqual(320);

    await page.evaluate(() => {
      document.documentElement.dataset.density = 'touch';
    });
    const height = await page.locator('button').boundingBox();
    expect(height?.height).toBeGreaterThanOrEqual(44);
  });

  test('keeps focus visible, themes, and reduced motion available', async ({ page }) => {
    await loadFixture(page);
    await page.keyboard.press('Tab');
    await expect(page.locator('input')).toBeFocused();
    expect(
      await page.locator('input').evaluate((element) => getComputedStyle(element).outlineStyle),
    ).toBe('solid');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(
      await page
        .locator('button')
        .evaluate((element) => getComputedStyle(element).transitionDuration),
    ).toBe('0s');
    await page.locator('html').evaluate((element) => {
      element.dataset.theme = 'high-contrast';
    });
    expect(await page.locator('html').getAttribute('data-theme')).toBe('high-contrast');
  });

  test('passes the automated accessibility smoke check', async ({ page }) => {
    await loadFixture(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
