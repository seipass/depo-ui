import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  aliasTarget,
  contrastRatio,
  createTokenModel,
  cssVariableName,
  flattenTokens,
  loadTokenModel,
  mergeTokenMaps,
  parseJson,
  resolveToken,
  resolvedTheme,
  validateContrast,
  validateDtcgDocument,
  validateTokenModel,
} from './model.mjs';

const token = (path, value, type = 'color', tier = 'reference') => ({
  path,
  sourceFile: 'test.json',
  tier,
  type,
  value,
  description: 'Test token',
  extensions: { 'depo-ui': { tier, status: 'stable' } },
});

const modelWith = ({ reference = [], semantic = [], themes = new Map() } = {}) =>
  createTokenModel({
    reference: new Map(reference),
    semantic: new Map(semantic),
    themes,
  });

describe('Depo UI token model', () => {
  it('loads the dark appearance and preserves the required palette anchors', async () => {
    const model = await loadTokenModel();

    expect(validateTokenModel(model)).toEqual([]);
    expect(validateContrast(model)).toEqual([]);
    expect(model.themes.size).toBe(1);
    expect(model.reference.get('color.brand.600').value).toBe('#6C6FF6');
    expect(model.reference.get('color.neutral.950').value).toBe('#05060A');
  });

  it('resolves semantic aliases against the dark appearance', async () => {
    const model = await loadTokenModel();

    expect(resolveToken(model, 'color.action.primary', 'dark').value).toBe('#6C6FF6');
    expect(() => resolveToken(model, 'color.action.primary', 'light')).toThrow(
      'unsupported theme light',
    );
  });

  it('rejects malformed JSON and malformed DTCG token metadata', () => {
    expect(() => parseJson('{', 'invalid.json')).toThrow(/invalid JSON/);

    const errors = validateDtcgDocument({ color: { broken: { $value: '#fff' } } }, 'invalid.json');
    expect(errors).toEqual(
      expect.arrayContaining([
        'invalid.json: color.broken is missing $type',
        'invalid.json: color.broken is missing $extensions.depo-ui',
      ]),
    );
  });

  it('rejects unknown aliases, alias cycles, and type mismatches', () => {
    const unknown = modelWith({ reference: [['known', token('known', '{missing}')]] });
    expect(() => resolveToken(unknown, 'known', 'dark')).toThrow(
      'references unknown token missing',
    );

    const cycle = modelWith({
      reference: [
        ['first', token('first', '{second}')],
        ['second', token('second', '{first}')],
      ],
    });
    expect(() => resolveToken(cycle, 'first', 'dark')).toThrow(/alias cycle/);

    const mismatch = modelWith({
      reference: [['number', token('number', 1, 'number')]],
      semantic: [['color', token('color', '{number}', 'color', 'semantic')]],
    });
    expect(() => resolveToken(mismatch, 'color', 'dark')).toThrow(/does not match/);
  });

  it('reports missing themes and duplicate token paths', () => {
    const missingThemeErrors = validateTokenModel(modelWith());
    expect(missingThemeErrors).toEqual(expect.arrayContaining(['missing theme dark']));

    const duplicate = mergeTokenMaps(
      [
        new Map([['same', token('same', '#000000')]]),
        new Map([['same', token('same', '#ffffff')]]),
      ],
      'reference',
    );
    expect(duplicate.errors).toEqual(['reference: duplicate token same']);

    const flattened = flattenTokens(
      {
        color: {
          brand: {
            600: {
              $type: 'color',
              $value: '#6C6FF6',
              $description: 'Test anchor',
              $extensions: { 'depo-ui': { tier: 'reference', status: 'stable' } },
            },
          },
        },
      },
      'valid.json',
      'reference',
    );
    expect(flattened.errors).toEqual([]);
    expect(flattened.tokens.get('color.brand.600').value).toBe('#6C6FF6');
  });

  it('keeps contrast calculation and generated naming deterministic', async () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBe(21);
    expect(cssVariableName('color.fg.primary')).toBe('--dui-color-fg-primary');
    expect(cssVariableName('density.comfortable.controlHeight')).toBe(
      '--dui-density-comfortable-control-height',
    );
    expect(aliasTarget('{color.brand.600}')).toBe('color.brand.600');

    const model = await loadTokenModel();
    for (const themeName of ['dark']) {
      const values = resolvedTheme(model, themeName);
      expect(
        contrastRatio(values.get('color.focus.ring').value, values.get('color.bg.canvas').value),
      ).toBeGreaterThanOrEqual(3);
    }

    const manifest = JSON.parse(await readFile('packages/tokens/generated/manifest.json', 'utf8'));
    const declaration = await readFile('packages/tokens/generated/tokens.d.ts', 'utf8');
    const css = await readFile('packages/tokens/generated/tokens.css', 'utf8');
    expect(manifest.format).toBe('DTCG Format Module 2025.10');
    expect(manifest.reference.find(({ path }) => path === 'color.brand.600').value).toBe('#6C6FF6');
    expect(manifest.appearance).toBe('dark');
    expect(manifest.values['color.action.primary'].value).toBe('#6C6FF6');
    expect(manifest).not.toHaveProperty('themes');
    expect(declaration).not.toContain('ThemeName');
    expect(css).not.toContain('data-theme');
    expect(css).not.toContain('prefers-color-scheme');
    expect(declaration).toContain('export declare const semanticTokens');
  });
});
