import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs.js';

describe('Breadcrumbs', () => {
  it('renders an ordered breadcrumb trail', () => {
    const markup = renderToStaticMarkup(
      <Breadcrumbs
        items={[
          { id: 'home', href: '/', label: 'Home' },
          { id: 'current', label: 'Current', current: true },
        ]}
      />,
    );
    expect(markup).toContain('<ol>');
    expect(markup).toContain('aria-current="page"');
  });
});
