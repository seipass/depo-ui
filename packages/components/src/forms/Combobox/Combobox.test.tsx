import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Combobox } from './Combobox.js';

describe('Combobox', () => {
  it('renders an input/listbox relationship with the shared form API', () => {
    const markup = renderToStaticMarkup(
      <Combobox
        label="Assignee"
        options={[
          { value: 'aiko', label: 'Aiko' },
          { value: 'ken', label: 'Ken' },
        ]}
      />,
    );
    expect(markup).toContain('role="combobox"');
    expect(markup).toContain('aria-haspopup="listbox"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('placeholder="Search options"');
  });
});
