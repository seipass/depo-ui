import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Disclosure } from './Disclosure.js';

describe('Disclosure accessibility', () => {
  it('keeps collapsed content hidden without removing the trigger', () => {
    const markup = renderToStaticMarkup(<Disclosure title="Details">Content</Disclosure>);
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('hidden=""');
  });
});
