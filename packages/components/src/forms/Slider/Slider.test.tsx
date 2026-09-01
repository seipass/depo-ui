import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Slider } from './Slider.js';

describe('Slider', () => {
  it('renders a native range input and current value', () => {
    const markup = renderToStaticMarkup(<Slider defaultValue={30} label="Opacity" max={100} />);
    expect(markup).toContain('type="range"');
    expect(markup).toContain('aria-label="Opacity"');
    expect(markup).toContain('value="30"');
    expect(markup).toContain('<output>30</output>');
  });
});
