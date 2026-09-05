import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { wcag22AaTags } from '../../../testing/accessibility/axe-config.mjs';
import { readFoundationStyles } from '../../../testing/fixtures/foundation-styles.mjs';

const fixture = `
  <main class="dui-container" data-dui-container data-padding="page" data-size="xl">
    <h1 class="dui-heading" data-dui-heading data-level="1">Accessibility fixture</h1>
    <section aria-labelledby="form-heading">
      <h2 id="form-heading">Account form</h2>
      <label for="display-name">Display name</label>
      <input aria-describedby="display-name-help" id="display-name" type="text" value="Depo UI" />
      <p id="display-name-help">Use a name your teammates will recognize.</p>
      <div aria-live="assertive" data-dui-live-region="error" role="alert">Fix the highlighted field.</div>
      <button type="button">Save changes</button>
    </section>
    <section aria-labelledby="content-heading">
      <h2 id="content-heading">Localized content</h2>
      <p lang="ja">長い日本語のラベルと説明文が狭い領域でも読みやすく折り返されます。</p>
      <nav aria-label="Section navigation">
        <a href="#form-heading">Account form</a>
        <a href="#content-heading">Localized content</a>
      </nav>
    </section>
    <div aria-live="polite" data-dui-live-region="global" role="status"></div>
  </main>
`;

async function loadFixture(page: Page) {
  const styles = await readFoundationStyles({ includePrimitives: true, includeComponents: true });
  await page.setContent(
    `<!doctype html><html lang="en" data-density="comfortable"><head><title>Accessibility fixture</title><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body>${fixture}</body></html>`,
  );
  await page.addStyleTag({ content: styles });
}

test.describe('Depo UI accessibility infrastructure browser contract', () => {
  test('keeps names, relationships, keyboard focus, and status semantics discoverable', async ({
    page,
  }) => {
    await loadFixture(page);
    await expect(page.getByRole('textbox', { name: 'Display name' })).toHaveAttribute(
      'aria-describedby',
      'display-name-help',
    );
    await expect(page.getByRole('alert')).toContainText('Fix the highlighted field.');
    await page.getByRole('textbox', { name: 'Display name' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeFocused();
  });

  test('reflows long localized content at a narrow viewport and enlarged text', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await loadFixture(page);
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    const metrics = await page.locator('main').evaluate((element) => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      mainScrollWidth: element.scrollWidth,
    }));
    expect(metrics.mainScrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  });

  test('passes WCAG A/AA automated checks in forced colors and reduced motion', async ({
    page,
  }) => {
    await loadFixture(page);
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await expect(page.locator('html')).not.toHaveAttribute('data-theme');
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme),
    ).toContain('dark');
    expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true,
    );
    const results = await new AxeBuilder({ page }).withTags(wcag22AaTags).analyze();
    expect(results.violations).toEqual([]);
  });
});
