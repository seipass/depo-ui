import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Tree } from './Tree.js';

describe('Tree accessibility', () => {
  it('exposes tree levels, selection, and disabled state', () => {
    const markup = renderToStaticMarkup(
      <Tree
        label="Project files"
        nodes={[{ id: 'readme', label: 'README', disabled: true }]}
        selected="readme"
      />,
    );
    expect(markup).toContain('aria-label="Project files"');
    expect(markup).toContain('aria-level="1"');
    expect(markup).toContain('aria-selected="true"');
    expect(markup).toContain('aria-disabled="true"');
  });
});
