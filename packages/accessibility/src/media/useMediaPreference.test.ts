import { describe, expect, it } from 'vitest';
import { getMediaPreference, mediaQueries } from './useMediaPreference.js';

describe('media preference helpers', () => {
  it('keeps the OS queries explicit and stable', () => {
    expect(mediaQueries.reducedMotion).toBe('(prefers-reduced-motion: reduce)');
    expect(mediaQueries.forcedColors).toBe('(forced-colors: active)');
  });

  it('reads a supplied matchMedia source without requiring a browser global', () => {
    const source = {
      matchMedia: ((query: string) => ({
        matches: query === mediaQueries.forcedColors,
      })) as Window['matchMedia'],
    };

    expect(getMediaPreference(mediaQueries.forcedColors, source)).toBe(true);
    expect(getMediaPreference(mediaQueries.reducedMotion, source)).toBe(false);
  });
});
