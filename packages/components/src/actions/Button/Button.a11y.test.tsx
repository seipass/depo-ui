import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from './Button.js';

describe('Button accessibility', () => {
  it('keeps loading state announced and prevents duplicate activation', () => {
    const markup = renderToStaticMarkup(
      <Button loading loadingLabel="Saving">
        Save
      </Button>,
    );
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('Saving');
  });
});
