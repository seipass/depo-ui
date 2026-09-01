// @vitest-environment happy-dom

import { act, useState, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { useRovingTabIndex, useTypeahead } from '../packages/accessibility/src/index.ts';

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

describe('Depo UI shared accessibility hooks', () => {
  it('moves focus and the single tab stop through the roving hook', () => {
    function Fixture() {
      const roving = useRovingTabIndex({
        getElementId: (id) => `item-${id}`,
        items: [{ id: 'one' }, { id: 'two' }, { id: 'three', disabled: true }],
        orientation: 'horizontal',
      });

      return (
        <div>
          {['one', 'two', 'three'].map((id) => (
            <button
              id={`item-${id}`}
              key={id}
              {...roving.getItemProps(id, { disabled: id === 'three' })}
              type="button"
            >
              {id}
            </button>
          ))}
        </div>
      );
    }

    const container = render(<Fixture />);
    const first = container.querySelector<HTMLButtonElement>('#item-one');
    first?.focus();
    act(() => {
      first?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
    });

    expect(document.activeElement?.id).toBe('item-two');
    expect((container.querySelector('#item-two') as HTMLButtonElement).tabIndex).toBe(0);
    expect((container.querySelector('#item-one') as HTMLButtonElement).tabIndex).toBe(-1);
  });

  it('matches typeahead input and exposes the selected index to the consumer', () => {
    function Fixture() {
      const [activeIndex, setActiveIndex] = useState(-1);
      const items = [{ label: 'Alpha' }, { label: 'Bravo' }];
      const typeahead = useTypeahead({
        activeIndex,
        getText: (item) => item.label,
        items,
        onMatch: (_item, index) => setActiveIndex(index),
      });

      return (
        <div data-active-index={activeIndex} onKeyDown={typeahead.onKeyDown} role="listbox">
          {items.map((item) => (
            <div key={item.label} role="option">
              {item.label}
            </div>
          ))}
        </div>
      );
    }

    const container = render(<Fixture />);
    act(() => {
      container
        .querySelector('[role="listbox"]')
        ?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'b' }));
    });

    expect(container.querySelector('[role="listbox"]')?.getAttribute('data-active-index')).toBe(
      '1',
    );
  });
});
