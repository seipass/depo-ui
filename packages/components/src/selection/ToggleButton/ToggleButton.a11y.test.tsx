import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ToggleButton } from './ToggleButton.js';

describe('ToggleButton accessibility', () => {
  it('keeps the native button contract when disabled', () => {
    const markup = renderToStaticMarkup(<ToggleButton disabled>Pin</ToggleButton>);
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('type="button"');
  });
});
