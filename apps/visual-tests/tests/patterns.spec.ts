import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFoundationStyles } from '../../../testing/fixtures/foundation-styles.mjs';

const fixture = `
  <div class="dui-container" data-dui-container data-padding="page" data-size="xl">
    <main aria-label="Pattern examples">
    <h1 class="dui-heading" data-dui-heading data-level="1">Patterns</h1>
    <section aria-label="Search and filter" data-dui-pattern="search-filter" data-state="results">
      <div data-dui-pattern-toolbar="">
        <label for="pattern-search">Search</label>
        <input id="pattern-search" aria-label="Search" class="dui-search-field" data-dui-search-field data-dui-control type="search" value="active" />
        <div aria-label="Active filters" data-dui-pattern-filters=""><span class="dui-tag" data-dui-tag>Status: active<button aria-label="Remove status filter" type="button">Remove</button></span></div>
      </div>
      <div aria-live="polite" data-dui-pattern-result-count="">12 results</div>
      <ul class="dui-list" data-dui-list><li>Project One</li><li>Project Two</li></ul>
    </section>
    <section aria-label="List and detail" data-dui-pattern="list-detail" data-layout="split">
      <nav aria-label="Items" data-dui-pattern-list=""><ul><li><button aria-current="true" type="button">Project One</button></li><li><button type="button">Project Two</button></li></ul></nav>
      <article aria-live="polite" data-dui-pattern-detail><h2>Project One</h2><p>Project details.</p></article>
    </section>
    <section aria-label="Records" aria-busy="false" data-dui-pattern="data-management" data-state="ready">
      <div aria-label="Accounts" aria-rowcount="2" aria-colcount="1" data-dui-data-grid role="grid"><div aria-rowindex="1" role="row"><div role="columnheader">Name</div></div><div aria-rowindex="2" role="row"><div aria-colindex="1" role="gridcell" tabindex="0">Project One</div></div></div>
    </section>
    <section aria-label="Recovery" data-dui-pattern="error-recovery"><div aria-labelledby="error-title" data-dui-error-state role="alert"><h2 id="error-title">Records unavailable</h2><p>Check your connection and try again.</p><button type="button">Retry</button></div></section>
    <header data-dui-top-nav><a href="/">Depo UI</a><nav aria-label="Primary navigation"><ul><li><a aria-current="page" href="/overview">Overview</a></li><li><a href="/settings">Settings</a></li></ul></nav></header>
    </main>
  </div>
`;

async function loadFixture(page: Page) {
  const styles = await readFoundationStyles({ includePrimitives: true, includeComponents: true });
  await page.setContent(
    `<!doctype html><html lang="en" data-theme="dark" data-density="comfortable"><head><title>Patterns</title></head><body>${fixture}</body></html>`,
  );
  await page.addStyleTag({ content: styles });
}

test.describe('Depo UI pattern browser contract', () => {
  test('reflows pattern compositions in a narrow container', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await loadFixture(page);
    await expect(page.getByRole('searchbox', { name: 'Search' })).toBeVisible();
    await expect(page.getByRole('grid', { name: 'Accounts' })).toBeVisible();
    expect(
      await page
        .locator('main')
        .first()
        .evaluate((element) => element.scrollWidth),
    ).toBeLessThanOrEqual(360);
  });

  test('keeps recovery actions and selected detail reachable', async ({ page }) => {
    await loadFixture(page);
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Project One' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await page.getByRole('gridcell', { name: 'Project One' }).focus();
    await expect(page.getByRole('gridcell', { name: 'Project One' })).toBeFocused();
  });

  test('passes accessibility checks in forced colors and reduced motion', async ({ page }) => {
    await loadFixture(page);
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
