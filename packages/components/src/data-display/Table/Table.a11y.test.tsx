import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Table } from './Table.js';

describe('Table accessibility', () => {
  it('does not claim grid semantics for a static data table', () => {
    const markup = renderToStaticMarkup(
      <Table caption="People" headers={['Name']} rows={[['Ada']]} />,
    );
    expect(markup).toContain('<table');
    expect(markup).not.toContain('role="grid"');
  });
});
