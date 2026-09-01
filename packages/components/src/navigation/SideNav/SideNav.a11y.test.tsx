import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SideNav } from './SideNav.js';

describe('SideNav accessibility', () => {
  it('removes unavailable links from the tab sequence', () => {
    const markup = renderToStaticMarkup(
      <SideNav items={[{ id: 'admin', href: '/admin', label: 'Admin', disabled: true }]} />,
    );
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('tabindex="-1"');
  });
});
