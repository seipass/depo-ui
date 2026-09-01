// @vitest-environment happy-dom

import { act, createElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { announce } from './announce.js';
import { LiveRegion, useLiveRegion } from './LiveRegion.js';

const roots: Root[] = [];

afterEach(() => {
  roots.forEach((root) => root.unmount());
  roots.splice(0);
  document.body.innerHTML = '';
});

function render(element: ReactNode) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  roots.push(root);
  act(() => root.render(element));
  return container;
}

describe('Depo UI live region helpers', () => {
  it('renders a hidden region with explicit status semantics', () => {
    const markup = renderToStaticMarkup(
      <LiveRegion message="Saved" politeness="assertive" data-test="live" />,
    );

    expect(markup).toContain('aria-live="assertive"');
    expect(markup).toContain('role="alert"');
    expect(markup).toContain('aria-atomic="true"');
    expect(markup).toContain('data-dui-live-region');
    expect(markup).toContain('Saved');
  });

  it('creates and updates the browser-global announcement region', () => {
    expect(announce('Saved')).toBe(true);
    expect(document.querySelector('[data-dui-live-region="global"]')?.textContent).toBe('Saved');

    announce('Could not save', 'assertive');
    const region = document.querySelector('[data-dui-live-region="global"]');
    expect(region?.getAttribute('aria-live')).toBe('assertive');
    expect(region?.getAttribute('role')).toBe('alert');
    expect(region?.textContent).toBe('Could not save');
  });

  it('keeps hook state and rendered announcements together', () => {
    function Fixture() {
      const liveRegion = useLiveRegion();
      return (
        <>
          <button onClick={() => liveRegion.announce('Updated')} type="button">
            Update
          </button>
          <LiveRegion message={liveRegion.message} />
        </>
      );
    }

    const container = render(createElement(Fixture));
    act(() => container.querySelector('button')?.click());
    expect(container.querySelector('[data-dui-live-region=""]')?.textContent).toBe('Updated');
  });
});
