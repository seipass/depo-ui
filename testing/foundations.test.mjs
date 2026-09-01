import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  foundationAttributes,
  foundationDensities,
  foundationDirections,
  foundationThemes,
  foundationTokens,
  isFoundationDensity,
  isFoundationDirection,
  isFoundationTheme,
} from '../packages/foundations/src/index.ts';

describe('Depo UI foundations', () => {
  it('exposes the supported theme, density, and direction contract', () => {
    expect(foundationThemes).toEqual(['dark', 'light', 'high-contrast']);
    expect(foundationDensities).toEqual(['compact', 'comfortable', 'touch']);
    expect(foundationDirections).toEqual(['ltr', 'rtl']);
    expect(foundationAttributes()).toEqual({
      'data-theme': 'dark',
      'data-density': 'comfortable',
      dir: 'ltr',
    });
    expect(isFoundationTheme('light')).toBe(true);
    expect(isFoundationDensity('touch')).toBe(true);
    expect(isFoundationDirection('rtl')).toBe(true);
    expect(isFoundationTheme('unknown')).toBe(false);
  });

  it('uses semantic CSS variables rather than raw foundation values', async () => {
    expect(foundationTokens.color.canvas).toBe('var(--dui-color-bg-canvas)');
    expect(foundationTokens.size.touchTarget).toBe('var(--dui-size-control-touch)');

    const css = await readFile('packages/foundations/src/css/index.css', 'utf8');
    expect(css).toContain("@import './reset.css'");
    expect(await readFile('packages/foundations/src/css/density.css', 'utf8')).toContain(
      '--dui-density-touch-control-height',
    );
    expect(await readFile('packages/foundations/src/css/motion.css', 'utf8')).toContain(
      'prefers-reduced-motion',
    );
  });
});
