import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MenuButton } from './MenuButton.js';

describe('MenuButton accessibility', () => {
  it('uses a native button trigger', () => {
    const markup = renderToStaticMarkup(
      <MenuButton items={[{ id: 'help', label: 'Help' }]} label="More" />,
    );
    expect(markup).toContain('<button');
    expect(markup).toContain('type="button"');
  });
});
