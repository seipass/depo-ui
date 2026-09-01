import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from '../../actions/Button/index.js';
import { Menu } from './Menu.js';

describe('Menu accessibility', () => {
  it('does not expose disabled menu items as active controls', () => {
    const markup = renderToStaticMarkup(
      <Menu
        defaultOpen
        items={[{ id: 'delete', label: 'Delete', disabled: true }]}
        trigger={<Button>Actions</Button>}
      />,
    );
    expect(markup).toContain('role="menuitem"');
    expect(markup).toContain('aria-disabled="true"');
  });
});
