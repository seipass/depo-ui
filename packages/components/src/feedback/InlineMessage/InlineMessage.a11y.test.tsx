import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { InlineMessage } from './InlineMessage.js';

describe('InlineMessage accessibility', () => {
  it('announces danger feedback as an alert', () => {
    const markup = renderToStaticMarkup(
      <InlineMessage tone="danger">Could not save</InlineMessage>,
    );
    expect(markup).toContain('role="alert"');
    expect(markup).toContain('aria-live="assertive"');
  });
});
