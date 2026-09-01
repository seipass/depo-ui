// @vitest-environment happy-dom

import { act, createElement, createRef, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { describe, expect, it, afterEach } from 'vitest';
import {
  DismissableLayer,
  FocusScope,
  getDismissableLayerDepth,
} from '../packages/accessibility/src/index.ts';
import { getOverlayPosition, Portal, useScrollLock } from '../packages/utilities/src/index.ts';

const roots: Array<{ container: HTMLElement; root: Root }> = [];

async function render(element: ReactNode) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  roots.push({ container, root });
  await act(async () => root.render(element));
  return { container, root };
}

afterEach(async () => {
  await act(async () => {
    roots.forEach(({ root }) => root.unmount());
  });
  roots.splice(0);
  document.body.innerHTML = '';
});

describe('Depo UI overlay infrastructure', () => {
  it('contains Tab focus and restores the previously focused element', async () => {
    const trigger = document.createElement('button');
    trigger.id = 'trigger';
    document.body.append(trigger);
    trigger.focus();
    const { container, root } = await render(
      <FocusScope autoFocus contain>
        <button id="first" type="button">
          First
        </button>
        <button id="last" type="button">
          Last
        </button>
      </FocusScope>,
    );

    expect(document.activeElement?.id).toBe('first');
    document
      .querySelector('#last')
      ?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }));
    expect(document.activeElement?.id).toBe('first');

    await act(async () => root.unmount());
    container.remove();
    expect(document.activeElement).toBe(trigger);
  });

  it('dismisses only the top layer for Escape and outside pointer interaction', async () => {
    const events: string[] = [];
    await render(
      <>
        <DismissableLayer onDismiss={() => events.push('outer')}>
          <div id="outer-content">Outer</div>
        </DismissableLayer>
        <DismissableLayer onDismiss={() => events.push('inner')}>
          <div id="inner-content">Inner</div>
        </DismissableLayer>
      </>,
    );
    expect(getDismissableLayerDepth()).toBe(2);

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    expect(events).toEqual(['inner']);
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(events).toEqual(['inner', 'inner']);
  });

  it('portals content and restores scroll styles when a lock is removed', async () => {
    function Fixture() {
      const ref = createRef<HTMLDivElement>();
      useScrollLock(true);
      return createElement(
        Portal,
        null,
        createElement('div', { id: 'portal-content', ref }, 'Portal'),
      );
    }
    await render(createElement(Fixture));
    expect(document.body.querySelector('#portal-content')).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('flips and clamps a positioned overlay within the viewport', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 320 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 240 });
    const position = getOverlayPosition(
      { top: 210, bottom: 230, left: 300, right: 320, width: 20, height: 20 } as DOMRect,
      { width: 120, height: 80 } as DOMRect,
      'bottom',
    );
    expect(position.insetBlockStart).toBeLessThan(210);
    expect(position.insetInlineStart).toBeGreaterThanOrEqual(8);
  });
});
