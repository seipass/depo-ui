import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SplitButton } from './SplitButton.js';

describe('SplitButton', () => {
  it('renders the primary action and menu trigger together', () => {
    const markup = renderToStaticMarkup(
      <SplitButton items={[{ id: 'archive', label: 'Archive' }]} label="Save" />,
    );
    expect(markup).toContain('data-dui-split-button');
    expect(markup).toContain('Save');
    expect(markup).toContain('More actions');
  });
});
