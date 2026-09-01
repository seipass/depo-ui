import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MenuButton } from './MenuButton.js';

describe('MenuButton', () => {
  it('composes a named Button with Menu', () => {
    const markup = renderToStaticMarkup(
      <MenuButton items={[{ id: 'help', label: 'Help' }]} label="More" />,
    );
    expect(markup).toContain('>More</button>');
    expect(markup).toContain('aria-haspopup="menu"');
  });
});
