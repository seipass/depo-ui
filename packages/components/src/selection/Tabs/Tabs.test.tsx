import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Tabs } from './Tabs.js';

describe('Tabs', () => {
  it('renders one selected tab and its associated panel', () => {
    const markup = renderToStaticMarkup(
      <Tabs
        items={[
          { id: 'one', label: 'One', content: 'First' },
          { id: 'two', label: 'Two', content: 'Second' },
        ]}
      />,
    );
    expect(markup).toContain('role="tablist"');
    expect(markup).toContain('role="tabpanel"');
    expect(markup).toContain('aria-selected="true"');
  });
});
