import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Pagination } from './Pagination.js';

describe('Pagination', () => {
  it('renders the current page and boundary controls', () => {
    const markup = renderToStaticMarkup(<Pagination page={2} pageCount={5} />);
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain('Previous');
    expect(markup).toContain('Next');
  });
});
