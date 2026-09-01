import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from '../../actions/Button/index.js';
import { Menu } from './Menu.js';

describe('Menu', () => {
  it('connects its trigger to an action menu', () => {
    const markup = renderToStaticMarkup(
      <Menu items={[{ id: 'edit', label: 'Edit' }]} trigger={<Button>Edit actions</Button>} />,
    );
    expect(markup).toContain('aria-haspopup="menu"');
    expect(markup).toContain('aria-expanded="false"');
  });
});
