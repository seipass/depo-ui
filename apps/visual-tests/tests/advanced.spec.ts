import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFoundationStyles } from '../../../testing/fixtures/foundation-styles.mjs';

const fixture = `
  <main class="dui-container" data-dui-container data-padding="page" data-size="xl">
    <h1 class="dui-heading" data-dui-heading data-level="1">Advanced components</h1>
    <section aria-labelledby="search-heading">
      <h2 id="search-heading">Search</h2>
      <label for="assignee">Assignee</label>
      <input id="assignee" aria-activedescendant="assignee-aiko" aria-autocomplete="list" aria-controls="assignee-list" aria-expanded="true" aria-haspopup="listbox" role="combobox" value="A" />
      <div id="assignee-list" aria-label="Assignee options" role="listbox">
        <div id="assignee-aiko" aria-selected="true" role="option">Aiko</div>
        <div id="assignee-ken" aria-selected="false" role="option">Ken</div>
      </div>
    </section>
    <section aria-labelledby="records-heading">
      <h2 id="records-heading">Records</h2>
      <div aria-colcount="2" aria-label="Accounts" aria-rowcount="3" data-dui-data-grid role="grid">
        <div aria-rowindex="1" class="dui-data-grid-row" role="row"><div class="dui-data-grid-cell" role="columnheader">Name</div><div class="dui-data-grid-cell" role="columnheader">Owner</div></div>
        <div aria-rowindex="2" class="dui-data-grid-row" role="row"><div aria-colindex="1" class="dui-data-grid-cell" role="gridcell" tabindex="0">Project One</div><div aria-colindex="2" class="dui-data-grid-cell" role="gridcell" tabindex="-1">Aiko</div></div>
        <div aria-rowindex="3" class="dui-data-grid-row" role="row"><div aria-colindex="1" class="dui-data-grid-cell" role="gridcell" tabindex="-1">Project Two</div><div aria-colindex="2" class="dui-data-grid-cell" role="gridcell" tabindex="-1">Ken</div></div>
      </div>
    </section>
    <section aria-labelledby="tree-heading">
      <h2 id="tree-heading">Files</h2>
      <div aria-label="Project files" data-dui-tree role="tree" tabindex="0">
        <div aria-expanded="true" aria-level="1" class="dui-tree-item" role="treeitem" tabindex="0">Project</div>
        <div role="group"><div aria-level="2" class="dui-tree-item" role="treeitem" tabindex="-1">README.md</div></div>
      </div>
    </section>
    <div aria-hidden="true" class="dui-drawer-backdrop" data-dui-drawer-backdrop></div>
    <div aria-labelledby="drawer-title" aria-modal="true" class="dui-drawer" data-dui-drawer data-side="end" role="dialog">
      <h2 id="drawer-title">Filters</h2>
      <p>Refine the records.</p>
      <button type="button">Close filters</button>
    </div>
  </main>
`;

async function loadFixture(page: Page) {
  const styles = await readFoundationStyles({ includePrimitives: true, includeComponents: true });
  await page.setContent(
    `<!doctype html><html lang="en" data-density="comfortable"><head><title>Advanced components</title></head><body>${fixture}</body></html>`,
  );
  await page.addStyleTag({ content: styles });
}

test.describe('Depo UI advanced browser contract', () => {
  test('keeps large data and hierarchical content within a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await loadFixture(page);
    await expect(page.getByRole('grid', { name: 'Accounts' })).toBeVisible();
    await expect(page.getByRole('tree', { name: 'Project files' })).toBeVisible();
    expect(
      await page.locator('main').evaluate((element) => element.scrollWidth),
    ).toBeLessThanOrEqual(360);
  });

  test('exposes focusable grid cells and active combobox relationships', async ({ page }) => {
    await loadFixture(page);
    await page.getByRole('combobox', { name: 'Assignee' }).focus();
    await expect(page.getByRole('combobox', { name: 'Assignee' })).toBeFocused();
    await expect(page.getByRole('gridcell', { name: 'Project One' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    await expect(page.getByRole('combobox', { name: 'Assignee' })).toHaveAttribute(
      'aria-controls',
      'assignee-list',
    );
  });

  test('passes accessibility checks with forced colors and reduced motion', async ({ page }) => {
    await loadFixture(page);
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
