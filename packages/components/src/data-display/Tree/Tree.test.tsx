import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Tree } from './Tree.js';

describe('Tree', () => {
  it('renders hierarchical items and expanded groups', () => {
    const markup = renderToStaticMarkup(
      <Tree
        defaultExpanded={['root']}
        nodes={[{ id: 'root', label: 'Root', children: [{ id: 'child', label: 'Child' }] }]}
      />,
    );
    expect(markup).toContain('role="tree"');
    expect(markup).toContain('aria-expanded="true"');
    expect(markup).toContain('role="group"');
    expect(markup).toContain('Child');
  });
});
