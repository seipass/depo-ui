import { readFile } from 'node:fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';
import { validateDocs } from '../tooling/docs-generator/validate-links.mjs';

let generated;
let checked;

beforeAll(async () => {
  checked = await validateDocs();
  generated = { navigation: checked.manifest.navigation, model: checked.manifest };
});

describe('documentation source pipeline', () => {
  it('publishes the complete navigation and metadata inventory', () => {
    expect(generated.navigation).toHaveLength(10);
    expect(generated.model.components).toHaveLength(56);
    expect(generated.model.patterns).toHaveLength(19);
    expect(generated.model.tokens.themes).toEqual(['dark', 'high-contrast', 'light']);
    expect(checked.manifest.figma.componentCount).toBe(56);
  });

  it('keeps generated references linked to canonical source paths', () => {
    expect(
      checked.manifest.components.every((entry) =>
        entry.sourcePath.startsWith('packages/components/src/'),
      ),
    ).toBe(true);
    expect(checked.manifest.components.some((entry) => entry.storyPath)).toBe(true);
    expect(
      checked.manifest.patterns.every((entry) => entry.metadataPath.startsWith('specs/patterns/')),
    ).toBe(true);
  });

  it('keeps search entries unique and preview-ready', async () => {
    expect(checked.search).toHaveLength(85);
    expect(new Set(checked.search.map((entry) => entry.path)).size).toBe(85);
    const preview = await readFile('apps/docs/static/generated/docs-preview.html', 'utf8');
    expect(preview).toContain('role="search"');
    expect(preview).toContain('lang="ja"');
    expect(preview).toContain('prefers-reduced-motion');
  });
});
