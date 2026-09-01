import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Select } from './Select.js';

describe('Select accessibility', () => {
  it('uses an explicit accessible name and invalid state', () => {
    const markup = renderToStaticMarkup(
      <Select invalid label="Plan" options={[{ value: 'basic', label: 'Basic' }]} />,
    );
    expect(markup).toContain('aria-label="Plan"');
    expect(markup).toContain('aria-invalid="true"');
  });
});
