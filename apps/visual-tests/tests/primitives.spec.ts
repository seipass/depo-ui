import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFoundationStyles } from '../../../testing/fixtures/foundation-styles.mjs';

const fixtureStyle = `
  [data-primitive-grid] {
    gap: var(--dui-space-control-group);
  }

  [data-primitive-control] {
    min-block-size: var(--dui-foundation-control-height);
    color: var(--dui-color-action-on-primary);
    background: var(--dui-color-action-primary);
    border: var(--dui-border-width-default) solid var(--dui-color-border-default);
  }
`;

async function loadFixture(
  page: Page,
  density: 'compact' | 'comfortable' | 'touch' = 'comfortable',
) {
  const styles = await readFoundationStyles({ includePrimitives: true });
  await page.setContent(`
    <!doctype html>
    <html data-density="${density}" dir="rtl" lang="en">
      <head><title>Primitive fixture</title><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body>
        <main class="dui-container" data-dui-container data-padding="page" data-size="xl">
          <h1 class="dui-heading" data-dui-heading data-level="1">Primitive fixture</h1>
          <div
            class="dui-grid"
            data-columns="expanded"
            data-dui-grid
            data-gap="sm"
            data-primitive-grid
            data-responsive="true"
          >
            <div>אחד</div><div>二</div><div>Three</div><div>四</div>
          </div>
          <button data-primitive-control id="primitive-control" type="button">Continue</button>
        </main>
      </body>
    </html>
  `);
  await page.addStyleTag({ content: styles + fixtureStyle });
}

test.describe('Depo UI primitive browser contract', () => {
  test('uses container queries for narrow grids and preserves RTL layout', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await loadFixture(page);

    const metrics = await page.locator('[data-primitive-grid]').evaluate((element) => ({
      columns: getComputedStyle(element).gridTemplateColumns.split(' ').length,
      direction: getComputedStyle(document.documentElement).direction,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));

    expect(metrics.columns).toBe(4);
    expect(metrics.direction).toBe('rtl');
    expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
  });

  test('keeps keyboard focus visible and density control metrics tokenized', async ({ page }) => {
    await loadFixture(page, 'touch');
    const touchHeight = (await page.locator('#primitive-control').boundingBox())?.height ?? 0;
    expect(touchHeight).toBeGreaterThanOrEqual(44);

    await page.keyboard.press('Tab');
    await expect(page.locator('#primitive-control')).toBeFocused();
    await expect(page.locator('#primitive-control')).toHaveCSS('outline-style', 'solid');

    await loadFixture(page, 'compact');
    const compactHeight = (await page.locator('#primitive-control').boundingBox())?.height ?? 0;
    expect(compactHeight).toBeLessThan(touchHeight);
  });

  test('passes the automated accessibility smoke check', async ({ page }) => {
    await loadFixture(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
