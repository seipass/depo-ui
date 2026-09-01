import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CommandPalette } from './CommandPalette.js';

describe('CommandPalette', () => {
  it('renders the global shortcut affordance without opening by default', () => {
    const markup = renderToStaticMarkup(
      <CommandPalette commands={[{ id: 'settings', label: 'Settings' }]} shortcut="⌘K" />,
    );
    expect(markup).toContain('data-dui-command-palette');
    expect(markup).toContain('⌘K');
    expect(markup).not.toContain('role="dialog"');
  });
});
