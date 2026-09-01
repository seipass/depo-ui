import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Field } from '../Field/index.js';
import { TextInput } from './TextInput.js';

describe('TextInput', () => {
  it('associates a native input with Field help text', () => {
    const markup = renderToStaticMarkup(
      <Field description="Use a work address" label="Email">
        <TextInput type="email" />
      </Field>,
    );
    expect(markup).toContain('type="email"');
    expect(markup).toContain('aria-describedby=');
  });
});
