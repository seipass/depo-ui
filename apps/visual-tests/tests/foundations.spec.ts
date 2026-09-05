import { expect, test, type Page } from '@playwright/test';
import { readFoundationStyles } from '../../../testing/fixtures/foundation-styles.mjs';

const fixtureStyle = `
  [data-fixture] {
    display: grid;
    gap: var(--dui-foundation-gap);
    inline-size: 100%;
  }

  [data-fixture-panel] {
    min-inline-size: 0;
    overflow-wrap: anywhere;
  }

  [data-fixture-control] {
    min-block-size: var(--dui-foundation-control-height);
    min-inline-size: var(--dui-size-control-touch);
  }
`;

const longText =
  '長い日本語のラベルと mixed Latin text を含む content that must wrap without creating horizontal overflow.';

type FixtureOptions = {
  density?: 'compact' | 'comfortable' | 'touch';
  direction?: 'ltr' | 'rtl';
};

async function loadFixture(page: Page, options: FixtureOptions = {}) {
  const { density = 'comfortable', direction = 'ltr' } = options;
  const styles = await readFoundationStyles();

  await page.setContent(`
    <!doctype html>
    <html data-density="${density}" dir="${direction}">
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body>
        <main data-dui-container data-fixture>
          <section data-dui-panel data-fixture-panel>
            <h1>Foundation fixture</h1>
            <p data-text-measure>${longText}</p>
            <button data-fixture-control data-motion="feedback" type="button">Continue</button>
          </section>
        </main>
      </body>
    </html>
  `);
  await page.addStyleTag({ content: styles + fixtureStyle });
}

test.describe('Depo UI foundation browser contract', () => {
  test('reflows at narrow width, supports RTL, CJK, and long text', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await loadFixture(page, { direction: 'rtl' });

    const metrics = await page.evaluate(() => ({
      direction: document.documentElement.dir,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      panelWidth: document.querySelector('[data-fixture-panel]')?.getBoundingClientRect().width,
    }));

    expect(metrics.direction).toBe('rtl');
    expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
    expect(metrics.panelWidth).toBeLessThanOrEqual(metrics.viewportWidth);
  });

  test('keeps the touch target contract across density modes', async ({ page }) => {
    await loadFixture(page, { density: 'touch' });
    const touchMetrics = await page.locator('[data-fixture-control]').boundingBox();
    expect(touchMetrics?.height).toBeGreaterThanOrEqual(44);

    await loadFixture(page, { density: 'compact' });
    const compactMetrics = await page.locator('[data-fixture-control]').boundingBox();
    expect(compactMetrics?.height).toBeLessThan(touchMetrics?.height ?? 0);
  });

  test('supports 200% text resize and reduced motion', async ({ page }) => {
    await loadFixture(page);
    const initialFontSize = await page
      .locator('body')
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));

    await page.locator('body').evaluate((element) => {
      element.style.fontSize = '200%';
    });
    const resizedFontSize = await page
      .locator('body')
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
    expect(resizedFontSize).toBeGreaterThanOrEqual(initialFontSize * 2);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    const reducedMotionDuration = await page
      .locator('[data-fixture-control]')
      .evaluate((element) => getComputedStyle(element).transitionDuration);
    expect(reducedMotionDuration).toBe('0s');
  });

  test('keeps dark appearance and forced-colors semantics available', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    await loadFixture(page);

    const mediaState = await page.evaluate(() => ({
      forcedColors: matchMedia('(forced-colors: active)').matches,
      themeAttribute: document.documentElement.dataset.theme,
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
    }));

    expect(mediaState.forcedColors).toBe(true);
    expect(mediaState.themeAttribute).toBeUndefined();
    expect(mediaState.colorScheme).toContain('dark');
  });
});
