import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Tabs } from './Tabs.js';

describe('Tabs accessibility', () => {
  it('exposes orientation and roving tabindex semantics', () => {
    const markup = renderToStaticMarkup(
      <Tabs orientation="vertical" items={[{ id: 'one', label: 'One', content: 'First' }]} />,
    );
    expect(markup).toContain('aria-orientation="vertical"');
    expect(markup).toContain('role="tab"');
    expect(markup).toContain('tabindex="0"');
  });
});
