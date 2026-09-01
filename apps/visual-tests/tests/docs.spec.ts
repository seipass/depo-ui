import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { wcag22AaTags } from '../../../testing/accessibility/axe-config.mjs';

let previewHtml = '';

test.beforeAll(() => {
  execFileSync(process.execPath, ['tooling/docs-generator/generate.mjs'], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });
  previewHtml = readFileSync('apps/docs/static/generated/docs-preview.html', 'utf8');
});

async function loadPreview(page: Page) {
  await page.setContent(previewHtml);
}

test.describe('Depo UI documentation site contract', () => {
  test.describe.configure({ mode: 'serial' });

  test('exposes the ten documentation sections with usable landmarks', async ({ page }) => {
    await loadPreview(page);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Build clear, resilient Web applications.',
    );
    await expect(
      page.getByRole('navigation', { name: 'Documentation sections' }).getByRole('link'),
    ).toHaveCount(10);
    await expect(page.getByRole('search')).toBeVisible();
    await expect(page.getByLabel('Search documentation')).toBeVisible();
  });

  test('keeps keyboard focus and content within a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await loadPreview(page);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    const metrics = await page.locator('main').evaluate((element) => ({
      clientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      mainScrollWidth: element.scrollWidth,
    }));
    expect(metrics.mainScrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
    expect(metrics.documentScrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  });

  test('supports forced colors and reduced motion without losing semantics', async ({ page }) => {
    await loadPreview(page);
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true,
    );
    const results = await new AxeBuilder({ page }).withTags(wcag22AaTags).analyze();
    expect(results.violations).toEqual([]);
  });
});
