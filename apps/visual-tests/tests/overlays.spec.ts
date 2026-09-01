import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFoundationStyles } from '../../../testing/fixtures/foundation-styles.mjs';

async function loadOverlayFixture(page: Page) {
  const styles = await readFoundationStyles({ includePrimitives: true, includeComponents: true });
  await page.setContent(`
    <!doctype html>
    <html lang="en" data-theme="dark" data-density="comfortable">
      <head><title>Overlay fixture</title></head>
      <body>
        <main id="app"><button id="open" type="button">Open details</button></main>
        <div class="dui-dialog-root" data-dui-dialog-root>
          <div class="dui-dialog-backdrop" data-dui-dialog-backdrop aria-hidden="true"></div>
          <div data-dui-dismissable-layer>
            <div class="dui-dialog" data-dui-dialog role="dialog" aria-modal="true" aria-labelledby="dialog-title">
              <h2 class="dui-dialog-title" id="dialog-title">Details</h2>
              <p>Dialog content remains readable on narrow screens.</p>
              <button id="close" type="button">Close</button>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
  await page.addStyleTag({ content: styles });
}

test.describe('Depo UI overlay browser contract', () => {
  test('keeps modal content layered, scrollable, and narrow-screen safe', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 480 });
    await loadOverlayFixture(page);
    await expect(page.locator('[data-dui-dialog]')).toHaveAttribute('role', 'dialog');
    const metrics = await page.locator('[data-dui-dialog]').evaluate((element) => ({
      width: element.getBoundingClientRect().width,
      overflow: getComputedStyle(element).overflow,
      zIndex: getComputedStyle(element.parentElement?.parentElement ?? element).zIndex,
    }));
    expect(metrics.width).toBeLessThanOrEqual(320);
    expect(metrics.overflow).toBe('auto');
    expect(metrics.zIndex).toBe('200');
  });

  test('returns focus after an Escape-driven close and preserves layer semantics', async ({
    page,
  }) => {
    await loadOverlayFixture(page);
    await page.locator('#open').focus();
    await page.evaluate(() => {
      const trigger = document.querySelector<HTMLElement>('#open');
      const dialogRoot = document.querySelector<HTMLElement>('[data-dui-dialog-root]');
      document.addEventListener(
        'keydown',
        (event) => {
          if (event.key !== 'Escape') return;
          dialogRoot?.remove();
          trigger?.focus();
        },
        { once: true },
      );
    });
    await page.keyboard.press('Escape');
    expect(
      await page.locator('#open').evaluate((element) => document.activeElement === element),
    ).toBe(true);
    await expect(page.locator('[data-dui-dialog-root]')).toHaveCount(0);
  });

  test('passes automated accessibility checks in forced colors and reduced motion', async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await loadOverlayFixture(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    expect(
      await page
        .locator('[data-dui-dialog]')
        .evaluate((element) => getComputedStyle(element).boxShadow),
    ).toBe('none');
  });
});
