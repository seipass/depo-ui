import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Pagination } from './Pagination.js';

describe('Pagination accessibility', () => {
  it('disables previous and next at the correct boundaries', () => {
    const markup = renderToStaticMarkup(<Pagination page={1} pageCount={1} />);
    expect(markup.match(/disabled=""/g)?.length).toBe(2);
    expect(markup).toContain('aria-label="Pagination"');
  });
});
