import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Drawer } from './Drawer.js';

describe('Drawer accessibility', () => {
  it('keeps the drawer trigger relationship available before opening', () => {
    const markup = renderToStaticMarkup(
      <Drawer title="Filters" trigger={<button type="button">Open filters</button>} />,
    );
    expect(markup).toContain('aria-haspopup="dialog"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('Open filters');
  });
});
