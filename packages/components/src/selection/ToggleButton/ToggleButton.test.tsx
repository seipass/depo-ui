import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ToggleButton } from './ToggleButton.js';

describe('ToggleButton', () => {
  it('renders the boolean state through aria-pressed', () => {
    const markup = renderToStaticMarkup(<ToggleButton defaultPressed>Pin</ToggleButton>);
    expect(markup).toContain('data-dui-toggle-button');
    expect(markup).toContain('aria-pressed="true"');
  });
});
