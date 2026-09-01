import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { InlineMessage } from './InlineMessage.js';

describe('InlineMessage', () => {
  it('uses status semantics for non-error feedback', () => {
    const markup = renderToStaticMarkup(<InlineMessage tone="success">Saved</InlineMessage>);
    expect(markup).toContain('role="status"');
  });
});
