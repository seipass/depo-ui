import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SplitButton } from './SplitButton.js';

describe('SplitButton accessibility', () => {
  it('gives the secondary action an accessible name', () => {
    const markup = renderToStaticMarkup(
      <SplitButton
        items={[{ id: 'archive', label: 'Archive' }]}
        label="Save"
        menuLabel="Actions"
      />,
    );
    expect(markup).toContain('aria-label="Actions"');
    expect(markup).toContain('type="button"');
  });
});
