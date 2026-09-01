import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from './Button.js';

describe('Button', () => {
  it('renders a native button with the shared API vocabulary', () => {
    const markup = renderToStaticMarkup(
      <Button tone="danger" variant="outline">
        Delete
      </Button>,
    );
    expect(markup).toContain('data-tone="danger"');
    expect(markup).toContain('data-variant="outline"');
    expect(markup).toContain('type="button"');
  });
});
