import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const runNode = (args, environment = {}) =>
  spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env, ...environment },
  });

describe('Phase 10 governance and release workflow', () => {
  it('validates the lifecycle, owner, evidence, migration, and version graph', () => {
    const result = runNode(['tooling/governance/check.mjs'], {
      RELEASE_CHECK_SKIP_PACK: 'true',
    });
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(result.stdout).toContain('cycle-free version graph');
  }, 15_000);

  it('treats a clean tree without release intents as a successful status no-op', () => {
    const result = runNode(['tooling/release/status.mjs']);
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(result.stdout).toContain('no pending release intents');
  });

  it('rejects a releaseable change without a Changeset when required', () => {
    const result = runNode(['tooling/governance/check.mjs'], {
      RELEASE_CHECK_SKIP_PACK: 'true',
      RELEASE_CHECK_REQUIRE_CHANGESET: 'true',
      RELEASE_CHANGED_FILES: 'packages/components/src/actions/Button/Button.tsx',
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('without a Changeset');
  }, 15_000);

  it('migrates the previous-version fixture with the registry codemod', async () => {
    const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'depo-ui-migration-test-'));
    const outputPath = path.join(temporaryDirectory, 'migrated-button.tsx');
    try {
      const result = runNode([
        'tooling/codemods/run.mjs',
        '--migration',
        'button-kind-to-variant',
        '--input',
        'testing/fixtures/migration/previous-button.tsx',
        '--output',
        outputPath,
      ]);
      const expected = await readFile(
        path.join(repoRoot, 'testing/fixtures/migration/expected-button.tsx'),
        'utf8',
      );
      expect(result.status, result.stderr || result.stdout).toBe(0);
      expect(await readFile(outputPath, 'utf8')).toBe(expected);
    } finally {
      await rm(temporaryDirectory, { recursive: true, force: true });
    }
  });

  it('keeps publish dry-run behind the approval guard', () => {
    const result = runNode(['tooling/release/publish.mjs'], {
      RELEASE_PUBLISH_APPROVED: 'true',
      RELEASE_PUBLISH_DRY_RUN: 'true',
      NODE_AUTH_TOKEN: 'fixture-token',
    });
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(result.stdout).toContain('no registry mutation');
  });
});
