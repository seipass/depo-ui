import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Table } from './Table.js';

describe('Table', () => {
  it('uses caption and native table header semantics', () => {
    const markup = renderToStaticMarkup(
      <Table caption="People" headers={['Name']} rows={[['Ada']]} />,
    );
    expect(markup).toContain('<caption>People</caption>');
    expect(markup).toContain('<th scope="col">Name</th>');
  });
});
