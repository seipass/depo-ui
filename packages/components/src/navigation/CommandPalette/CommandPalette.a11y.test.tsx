import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CommandPalette } from './CommandPalette.js';

describe('CommandPalette accessibility', () => {
  it('keeps an explicit shortcut affordance before the modal is opened', () => {
    const markup = renderToStaticMarkup(
      <CommandPalette
        commands={[{ id: 'help', label: 'Help' }]}
        label="Quick actions"
        shortcut="Ctrl+K"
      />,
    );
    expect(markup).toContain('Ctrl+K');
    expect(markup).not.toContain('role="dialog"');
  });
});
