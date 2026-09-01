import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DatePicker } from './DatePicker.js';

describe('DatePicker accessibility', () => {
  it('marks an invalid date field without hiding its accessible name', () => {
    const markup = renderToStaticMarkup(<DatePicker invalid label="Start date" />);
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-label="Start date"');
    expect(markup).toContain('data-invalid="true"');
  });
});
