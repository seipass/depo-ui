import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DataGrid } from './DataGrid.js';

describe('DataGrid accessibility', () => {
  it('exposes row and column counts for the grid model', () => {
    const markup = renderToStaticMarkup(
      <DataGrid
        caption="Accounts"
        columns={[{ id: 'name', header: 'Name' }]}
        rows={[
          { id: 'one', name: 'One' },
          { id: 'two', name: 'Two' },
        ]}
      />,
    );
    expect(markup).toContain('aria-label="Accounts"');
    expect(markup).toContain('aria-rowcount="3"');
    expect(markup).toContain('aria-colcount="1"');
    expect(markup).toContain('role="gridcell"');
  });
});
