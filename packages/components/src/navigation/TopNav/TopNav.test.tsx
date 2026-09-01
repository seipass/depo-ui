import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TopNav } from './TopNav.js';

describe('TopNav', () => {
  it('renders brand, primary links, and actions', () => {
    const markup = renderToStaticMarkup(
      <TopNav
        brand="Depo UI"
        items={[{ id: 'home', href: '/', label: 'Home' }]}
        actions="Account"
      />,
    );
    expect(markup).toContain('data-dui-top-nav');
    expect(markup).toContain('Depo UI');
    expect(markup).toContain('Account');
  });
});
