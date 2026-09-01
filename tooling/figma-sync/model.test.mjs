import { describe, expect, it } from 'vitest';
import { createSyncPlan, diffEntries, hasFigmaCredentials, selectSyncTransport } from './model.mjs';

const expected = {
  components: [
    {
      componentSet: 'Depo UI/actions/Button',
      depoUiKey: 'component.actions.Button',
      name: 'Button',
      sourcePath: 'packages/components/src/actions/Button',
    },
  ],
  variables: [
    {
      collection: 'depo-ui-semantic',
      depoUiKey: 'semantic.token.color.action.primary',
      figmaType: 'COLOR',
      modeIds: ['dark', 'light', 'high-contrast'],
      modes: { dark: '#6C6FF6', light: '#6C6FF6', 'high-contrast': '#6C6FF6' },
      name: 'Depo UI/Variables/color/action/primary',
      sourcePath: 'packages/tokens/src/semantic/color.json',
      tokenPath: 'color.action.primary',
    },
  ],
};

describe('Figma sync model', () => {
  it('detects missing, extra, changed, and renamed objects', () => {
    const diff = diffEntries(expected.variables, [
      {
        ...expected.variables[0],
        depoUiKey: 'semantic.token.color.action.primary.renamed',
        name: 'Depo UI/Variables/color/action/brand-primary',
      },
      {
        depoUiKey: 'semantic.token.extra',
        name: 'Depo UI/Variables/extra',
        sourcePath: 'figma-only',
      },
    ]);

    expect(diff.missing).toEqual([]);
    expect(diff.extra).toHaveLength(1);
    expect(diff.renamed).toEqual([
      {
        from: 'Depo UI/Variables/color/action/primary',
        key: 'semantic.token.color.action.primary',
        to: 'Depo UI/Variables/color/action/brand-primary',
      },
    ]);
  });

  it('keeps push preview non-destructive and pull read-only without credentials', () => {
    const push = createSyncPlan({ environment: {}, expected });
    const pull = createSyncPlan({
      actual: { components: [], variables: [] },
      direction: 'pull',
      expected,
    });

    expect(push.dryRun).toBe(true);
    expect(push.canApply).toBe(false);
    expect(push.transport).toEqual({ name: 'plugin-api', writable: false });
    expect(push.operations).toHaveLength(2);
    expect(pull.readOnly).toBe(true);
    expect(pull.operations).toEqual([]);
    expect(pull.diff.variables.missing).toHaveLength(1);
  });

  it('selects REST only for explicit credentials and endpoint', () => {
    expect(hasFigmaCredentials({})).toBe(false);
    expect(selectSyncTransport({ environment: {} }).name).toBe('plugin-api');
    expect(
      selectSyncTransport({
        environment: {
          FIGMA_ACCESS_TOKEN: 'test-token',
          FIGMA_API_URL: 'https://figma.invalid',
          FIGMA_FILE_KEY: 'test-file',
        },
      }),
    ).toEqual({
      name: 'rest',
      reason: 'Explicit REST endpoint and credentials are present.',
      writable: true,
    });
  });
});
