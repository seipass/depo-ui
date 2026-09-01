import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Slider } from './Slider.js';

describe('Slider accessibility', () => {
  it('keeps the label association and invalid state explicit', () => {
    const markup = renderToStaticMarkup(<Slider invalid label="Priority" />);
    expect(markup).toContain('aria-label="Priority"');
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('data-invalid="true"');
  });
});
