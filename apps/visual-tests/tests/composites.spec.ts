import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFoundationStyles } from '../../../testing/fixtures/foundation-styles.mjs';

const fixture = `
  <main class="dui-container" data-dui-container data-padding="page" data-size="xl">
    <h1 class="dui-heading" data-dui-heading data-level="1">Composite controls</h1>
    <nav class="dui-top-nav" data-dui-top-nav aria-label="Site header">
      <a class="dui-top-nav-brand" href="/">Depo UI</a>
      <nav aria-label="Primary navigation"><ul><li><a href="/overview" aria-current="page">Overview</a></li><li><a href="/settings">Settings</a></li></ul></nav>
    </nav>
    <section class="dui-tabs" data-dui-tabs data-orientation="horizontal">
      <div class="dui-tabs-list" data-dui-tabs-list role="tablist">
        <button class="dui-tab" id="tab-summary" aria-controls="panel-summary" aria-selected="true" role="tab" type="button" tabindex="0">Summary</button>
        <button class="dui-tab" id="tab-events" aria-controls="panel-events" aria-selected="false" role="tab" type="button" tabindex="-1">Events</button>
      </div>
      <div class="dui-tabpanel" id="panel-summary" aria-labelledby="tab-summary" role="tabpanel" tabindex="0">Summary content</div>
      <div class="dui-tabpanel" id="panel-events" aria-labelledby="tab-events" role="tabpanel" tabindex="0" hidden>Events content</div>
    </section>
      <section class="dui-accordion" data-dui-accordion data-type="single">
      <section><h2><button aria-controls="account-panel" aria-expanded="true" type="button">Account</button></h2><div id="account-panel" role="region">Account details</div></section>
    </section>
    <div class="dui-toast" data-dui-toast data-tone="success" role="status"><div class="dui-toast-content"><strong>Saved</strong><span>Your changes are live.</span></div></div>
  </main>
`;

async function loadFixture(page: Page) {
  const styles = await readFoundationStyles({ includePrimitives: true, includeComponents: true });
  await page.setContent(
    `<!doctype html><html lang="en" data-density="comfortable"><head><title>Composite components</title></head><body>${fixture}</body></html>`,
  );
  await page.addStyleTag({ content: styles });
}

test.describe('Depo UI composite browser contract', () => {
  test('preserves landmark semantics and reflows navigation at narrow width', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await loadFixture(page);
    await expect(page.getByRole('tablist')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
    expect(
      await page.locator('main').evaluate((element) => element.scrollWidth),
    ).toBeLessThanOrEqual(360);
  });

  test('keeps focusable tab semantics and state attributes available', async ({ page }) => {
    await loadFixture(page);
    await page.getByRole('tab', { name: 'Summary' }).focus();
    await expect(page.getByRole('tab', { name: 'Summary' })).toBeFocused();
    expect(await page.locator('[data-dui-tabs]').getAttribute('data-orientation')).toBe(
      'horizontal',
    );
    expect(await page.locator('[data-dui-toast]').getAttribute('role')).toBe('status');
  });

  test('passes automated accessibility checks in forced colors and reduced motion', async ({
    page,
  }) => {
    await loadFixture(page);
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
