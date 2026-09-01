import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TopNav } from './TopNav.js';

describe('TopNav accessibility', () => {
  it('provides a named navigation landmark', () => {
    const markup = renderToStaticMarkup(
      <TopNav brand="Depo UI" label="Main" items={[{ id: 'home', href: '/', label: 'Home' }]} />,
    );
    expect(markup).toContain('aria-label="Main"');
  });
});
