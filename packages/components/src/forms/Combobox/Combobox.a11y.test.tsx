import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Combobox } from './Combobox.js';

describe('Combobox accessibility', () => {
  it('exposes invalid and multiple selection state to assistive technology', () => {
    const markup = renderToStaticMarkup(
      <Combobox invalid multiple options={[{ value: 'one', label: 'One' }]} label="Tags" />,
    );
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-multiselectable="true"');
    expect(markup).toContain('aria-label="Tags"');
  });
});
