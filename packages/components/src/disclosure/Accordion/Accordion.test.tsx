import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion.js';

describe('Accordion', () => {
  it('supports a collection of independently expanded regions', () => {
    const markup = renderToStaticMarkup(
      <Accordion
        defaultValue={['one']}
        items={[
          { id: 'one', title: 'One', content: 'First' },
          { id: 'two', title: 'Two', content: 'Second' },
        ]}
      />,
    );
    expect(markup).toContain('data-type="multiple"');
    expect(markup).toContain('aria-expanded="true"');
  });
});
