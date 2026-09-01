import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SideNav } from './SideNav.js';

describe('SideNav', () => {
  it('renders a labelled navigation list', () => {
    const markup = renderToStaticMarkup(
      <SideNav
        label="Workspace"
        items={[{ id: 'home', href: '/', label: 'Home', current: true }]}
      />,
    );
    expect(markup).toContain('aria-label="Workspace"');
    expect(markup).toContain('aria-current="page"');
  });
});
