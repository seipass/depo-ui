import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Toast } from './Toast.js';

describe('Toast accessibility', () => {
  it('uses alert semantics for danger feedback', () => {
    const markup = renderToStaticMarkup(<Toast title="Could not save" tone="danger" />);
    expect(markup).toContain('role="alert"');
    expect(markup).toContain('aria-atomic="true"');
  });
});
