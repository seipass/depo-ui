import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Toast } from './Toast.js';

describe('Toast', () => {
  it('renders transient content and an optional recovery action', () => {
    const markup = renderToStaticMarkup(
      <Toast action={{ label: 'Undo', onClick: () => undefined }} title="Archived" />,
    );
    expect(markup).toContain('data-dui-toast');
    expect(markup).toContain('Undo');
  });
});
