import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  createExpectedSnapshot,
  createSyncPlan,
  loadFigmaSource,
  loadValidatedTokenModel,
} from '../tooling/figma-sync/model.mjs';

describe('Depo UI Figma architecture', () => {
  it('keeps token mode completeness and Component property vocabulary aligned', async () => {
    const model = await loadValidatedTokenModel();
    const source = await loadFigmaSource();
    const expected = createExpectedSnapshot({
      componentMapping: source.componentMapping,
      model,
      tokenMapping: source.tokenMapping,
    });

    expect(expected.variables).toHaveLength(model.semantic.size);
    expect(source.collections.collection.modes.map((mode) => mode.id)).toEqual([
      'dark',
      'light',
      'high-contrast',
    ]);
    expect(expected.variables.every((variable) => Object.keys(variable.modes).length === 3)).toBe(
      true,
    );
    expect(expected.components.length).toBeGreaterThan(0);
    expect(
      expected.components.every((component) =>
        ['Variant', 'Size', 'Tone', 'State', 'Lifecycle'].every(
          (property) => property in component.propertyDefinitions,
        ),
      ),
    ).toBe(true);
  });

  it('does not duplicate token values or Figma-only secrets in mapping files', async () => {
    const tokenMapping = await readFile('figma/mapping/tokens.json', 'utf8');
    const componentMapping = await readFile('figma/mapping/components.json', 'utf8');
    const policy = await readFile('figma/sync/policy.json', 'utf8');

    expect(tokenMapping).not.toMatch(/"\$value"\s*:/);
    expect(tokenMapping).not.toMatch(/"value"\s*:/);
    expect(componentMapping).not.toMatch(/"\$value"\s*:/);
    expect(policy).toContain('persistToRepository');
    expect(policy).toContain('"persistToRepository": false');
    expect(policy).not.toContain('test-token');
  });

  it('produces a repository-first dry-run for the generated catalog', async () => {
    const model = await loadValidatedTokenModel();
    const source = await loadFigmaSource();
    const expected = createExpectedSnapshot({
      componentMapping: source.componentMapping,
      model,
      tokenMapping: source.tokenMapping,
    });
    const plan = createSyncPlan({ environment: {}, expected });

    expect(plan.direction).toBe('push');
    expect(plan.dryRun).toBe(true);
    expect(plan.canApply).toBe(false);
    expect(plan.operations).toHaveLength(
      source.tokenMapping.variables.length + source.componentMapping.components.length,
    );
    expect(plan.operations.every((operation) => operation.action === 'create')).toBe(true);
  });

  it('exposes the generated parity report for CI and Docs', async () => {
    const report = JSON.parse(await readFile('figma/sync/parity-report.json', 'utf8'));
    expect(report.generatedBy).toBe('tooling/figma-sync/report.mjs');
    expect(report.variables).toMatchObject({ expected: 125, mapped: 125 });
    expect(report.variables.modes).toEqual(['dark', 'light', 'high-contrast']);
  });
});
