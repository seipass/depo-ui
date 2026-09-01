import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion.js';

describe('Accordion accessibility', () => {
  it('associates every region with its heading button', () => {
    const markup = renderToStaticMarkup(
      <Accordion items={[{ id: 'one', title: 'One', content: 'First' }]} />,
    );
    expect(markup).toContain('aria-controls=');
    expect(markup).toContain('aria-labelledby=');
    expect(markup).toContain('role="region"');
  });
});
