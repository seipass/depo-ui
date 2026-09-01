import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Drawer } from './Drawer.js';

describe('Drawer', () => {
  it('does not mount modal content until it is opened', () => {
    const markup = renderToStaticMarkup(<Drawer title="Filters">Filter controls</Drawer>);
    expect(markup).not.toContain('data-dui-drawer-root');
    expect(markup).not.toContain('role="dialog"');
  });
});
