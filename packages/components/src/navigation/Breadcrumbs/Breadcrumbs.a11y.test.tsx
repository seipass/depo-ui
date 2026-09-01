import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs.js';

describe('Breadcrumbs accessibility', () => {
  it('provides a navigation landmark label', () => {
    const markup = renderToStaticMarkup(
      <Breadcrumbs label="Location" items={[{ id: 'home', label: 'Home', href: '/' }]} />,
    );
    expect(markup).toContain('aria-label="Location"');
  });
});
