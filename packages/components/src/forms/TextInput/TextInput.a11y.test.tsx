import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TextInput } from './TextInput.js';

describe('TextInput accessibility', () => {
  it('exposes invalid state without replacing native input semantics', () => {
    const markup = renderToStaticMarkup(<TextInput aria-label="Email" invalid />);
    expect(markup).toContain('<input');
    expect(markup).toContain('aria-invalid="true"');
  });
});
