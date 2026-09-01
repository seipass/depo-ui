import { describe, expect, it } from 'vitest';
import { getNextRovingId, getRovingTabIndex } from './rovingTabIndex.js';

const items = [{ id: 'first' }, { id: 'disabled', disabled: true }, { id: 'last' }];

describe('roving tabindex helpers', () => {
  it('skips disabled items and wraps enabled items', () => {
    expect(getNextRovingId(items, 'first', 'ArrowRight', 'horizontal')).toBe('last');
    expect(getNextRovingId(items, 'first', 'ArrowLeft', 'horizontal')).toBe('last');
    expect(getNextRovingId(items, 'last', 'ArrowRight', 'horizontal', false)).toBe('last');
  });

  it('respects orientation and home/end boundaries', () => {
    expect(getNextRovingId(items, 'first', 'ArrowDown', 'horizontal')).toBeUndefined();
    expect(getNextRovingId(items, 'last', 'Home', 'horizontal')).toBe('first');
    expect(getNextRovingId(items, 'first', 'End', 'horizontal')).toBe('last');
  });

  it('returns one tab stop for the active enabled item', () => {
    expect(getRovingTabIndex('first', 'first')).toBe(0);
    expect(getRovingTabIndex('first', 'last')).toBe(-1);
    expect(getRovingTabIndex('first', 'first', true)).toBe(-1);
  });
});
