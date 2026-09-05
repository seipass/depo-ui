import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  foundationAttributes,
  foundationDensities,
  foundationDirections,
  foundationTokens,
  isFoundationDensity,
  isFoundationDirection,
} from '../packages/foundations/src/index.ts';

describe('Depo UI foundations', () => {
  it('exposes the dark-only appearance, density, and direction contract', () => {
    expect(foundationDensities).toEqual(['compact', 'comfortable', 'touch']);
    expect(foundationDirections).toEqual(['ltr', 'rtl']);
    expect(foundationAttributes()).toEqual({
      'data-density': 'comfortable',
      dir: 'ltr',
    });
    expect(isFoundationDensity('touch')).toBe(true);
    expect(isFoundationDirection('rtl')).toBe(true);
  });

  it('uses semantic CSS variables rather than raw foundation values', async () => {
    expect(foundationTokens.color.canvas).toBe('var(--dui-color-bg-canvas)');
    expect(foundationTokens.size.touchTarget).toBe('var(--dui-size-control-touch)');

    const css = await readFile('packages/foundations/src/css/index.css', 'utf8');
    expect(css).toContain("@import './reset.css'");
    const appearanceCss = await readFile('packages/foundations/src/css/appearance.css', 'utf8');
    expect(appearanceCss).toContain('color-scheme: dark');
    expect(appearanceCss).toContain('(forced-colors: active)');
    expect(appearanceCss).not.toContain('data-theme');
    expect(await readFile('packages/foundations/src/css/density.css', 'utf8')).toContain(
      '--dui-density-touch-control-height',
    );
    expect(await readFile('packages/foundations/src/css/motion.css', 'utf8')).toContain(
      'prefers-reduced-motion',
    );
  });
});
