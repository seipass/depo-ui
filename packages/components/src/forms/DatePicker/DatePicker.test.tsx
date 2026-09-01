import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DatePicker } from './DatePicker.js';

describe('DatePicker', () => {
  it('renders a date trigger with a dialog relationship', () => {
    const markup = renderToStaticMarkup(<DatePicker defaultValue="2026-09-01" label="Due date" />);
    expect(markup).toContain('data-dui-date-picker');
    expect(markup).toContain('aria-haspopup="dialog"');
    expect(markup).toContain('type="button"');
  });
});
