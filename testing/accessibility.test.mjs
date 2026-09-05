import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  axeOptions,
  stableCandidateAxeOptions,
  wcag22AaTags,
} from './accessibility/axe-config.mjs';
import { storybookA11yParameters } from './accessibility/storybook-config.mjs';
import {
  requiredAccessibilityChecks,
  stableComponentMatrix,
} from './fixtures/accessibility-matrix.mjs';

describe('Depo UI accessibility infrastructure', () => {
  it('keeps the automated Axe baseline scoped to WCAG A and AA', () => {
    expect(wcag22AaTags).toEqual(['wcag2a', 'wcag2aa']);
    expect(axeOptions.runOnly.values).toEqual(wcag22AaTags);
    expect(stableCandidateAxeOptions.rules['color-contrast']).toEqual({ enabled: true });
    expect(storybookA11yParameters.a11y.options).toBe(stableCandidateAxeOptions);
    expect(storybookA11yParameters.a11y.test).toBe('error');
  });

  it('tracks the required stable component matrix and fixture dimensions', () => {
    expect(stableComponentMatrix).toEqual([
      'Keyboard',
      'Focus',
      'Accessibility',
      'Dark',
      'Forced Colors',
      'Reduced Motion',
      'Responsive',
      'Long Text',
      'Visual Regression',
    ]);
    expect(requiredAccessibilityChecks).toEqual(
      expect.arrayContaining(['keyboard', 'screen-reader', 'forced-colors', 'rtl', 'localization']),
    );
  });

  it('keeps the manual evidence and coverage map discoverable', async () => {
    const checklist = await readFile('testing/accessibility/screen-reader-checklist.md', 'utf8');
    const map = JSON.parse(await readFile('testing/accessibility/coverage-map.json', 'utf8'));
    expect(checklist).toContain('NVDA with Chromium');
    expect(checklist).toContain('VoiceOver with Safari');
    expect(map.baseline).toBe('WCAG 2.2 AA');
    expect(map.areas).toHaveLength(9);
  });
});
