import { describe, expect, it } from 'vitest';
import { findTypeaheadMatch, isPrintableTypeaheadKey } from './typeahead.js';

const items = [
  { label: 'Alpha' },
  { label: 'Beta', disabled: true },
  { label: 'Bravo' },
  { label: '東京' },
];

describe('typeahead helpers', () => {
  it('matches from the active item and wraps around', () => {
    expect(findTypeaheadMatch(items, 'br', (item) => item.label)?.item.label).toBe('Bravo');
    expect(findTypeaheadMatch(items, 'al', (item) => item.label, 2)?.item.label).toBe('Alpha');
  });

  it('skips disabled items and supports localized labels', () => {
    expect(
      findTypeaheadMatch(items, 'be', (item) => item.label, 0, {
        isDisabled: (item) => item.disabled === true,
      }),
    ).toBeUndefined();
    expect(findTypeaheadMatch(items, '東京', (item) => item.label)?.index).toBe(3);
  });

  it('recognizes printable keys without modifier shortcuts', () => {
    expect(
      isPrintableTypeaheadKey({ key: 'a', altKey: false, ctrlKey: false, metaKey: false }),
    ).toBe(true);
    expect(
      isPrintableTypeaheadKey({ key: 'a', altKey: false, ctrlKey: true, metaKey: false }),
    ).toBe(false);
    expect(
      isPrintableTypeaheadKey({ key: 'ArrowDown', altKey: false, ctrlKey: false, metaKey: false }),
    ).toBe(false);
  });
});
