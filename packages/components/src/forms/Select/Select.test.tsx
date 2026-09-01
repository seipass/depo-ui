import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Select } from './Select.js';

describe('Select', () => {
  it('renders the selected value and shared control metadata', () => {
    const markup = renderToStaticMarkup(
      <Select
        defaultValue="pro"
        options={[
          { value: 'basic', label: 'Basic' },
          { value: 'pro', label: 'Pro' },
        ]}
      />,
    );
    expect(markup).toContain('data-dui-select');
    expect(markup).toContain('Pro');
    expect(markup).toContain('aria-haspopup="listbox"');
  });
});
