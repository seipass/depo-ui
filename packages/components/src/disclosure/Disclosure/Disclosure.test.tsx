import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Disclosure } from './Disclosure.js';

describe('Disclosure', () => {
  it('associates a button with its collapsible region', () => {
    const markup = renderToStaticMarkup(
      <Disclosure defaultExpanded title="Details">
        Content
      </Disclosure>,
    );
    expect(markup).toContain('aria-expanded="true"');
    expect(markup).toContain('role="region"');
  });
});
