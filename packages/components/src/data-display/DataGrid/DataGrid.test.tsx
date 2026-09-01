import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DataGrid } from './DataGrid.js';

describe('DataGrid', () => {
  it('renders grid rows, sortable headers, and selection controls', () => {
    const markup = renderToStaticMarkup(
      <DataGrid
        columns={[
          { id: 'name', header: 'Name', sortable: true },
          { id: 'status', header: 'Status' },
        ]}
        rows={[{ id: 'one', name: 'One', status: 'Ready' }]}
        selectable
      />,
    );
    expect(markup).toContain('role="grid"');
    expect(markup).toContain('aria-multiselectable="true"');
    expect(markup).toContain('role="columnheader"');
    expect(markup).toContain('Select all rows');
  });
});
