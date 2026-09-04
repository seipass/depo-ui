import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { readFileSync, readdirSync } from 'node:fs';
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

const hasPendingReleaseIntent = () =>
  readdirSync(path.join(repoRoot, '.changeset'), { withFileTypes: true }).some(
    (entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md',
  );

const reactVersion = () =>
  JSON.parse(readFileSync(path.join(repoRoot, 'packages/react/package.json'), 'utf8')).version;

describe('Phase 10 governance and release workflow', () => {
  it('validates the lifecycle, owner, evidence, migration, and version graph', () => {
    const result = runNode(['tooling/governance/check.mjs'], {
      RELEASE_CHECK_SKIP_PACK: 'true',
    });
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(result.stdout).toContain('cycle-free version graph');
  }, 15_000);

  it('reports the initial public release intent through Changesets', () => {
    const result = runNode(['tooling/release/status.mjs']);
    expect(result.status, result.stderr || result.stdout).toBe(0);
    if (hasPendingReleaseIntent()) {
      expect(result.stdout).toContain('@depo-ui/react');
      expect(result.stdout).toContain('@depo-ui/tokens');
    } else {
      expect(result.stdout).toContain('no pending release intents');
      expect(reactVersion()).not.toBe('0.0.0');
    }
  }, 20_000);

  it('recognizes the public source release intent when Changeset enforcement is enabled', () => {
    const result = runNode(['tooling/governance/check.mjs'], {
      RELEASE_CHECK_SKIP_PACK: 'true',
      RELEASE_CHECK_REQUIRE_CHANGESET: 'true',
      RELEASE_CHANGED_FILES: 'packages/components/src/actions/Button/Button.tsx',
    });
    if (!hasPendingReleaseIntent()) {
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('releaseable source changed without a Changeset');
      return;
    }
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(result.stdout).toContain('cycle-free version graph');
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
  }, 20_000);

  it('keeps publish dry-run behind the approval guard', () => {
    const result = runNode(['tooling/release/publish.mjs'], {
      RELEASE_PUBLISH_APPROVED: 'true',
      RELEASE_PUBLISH_DRY_RUN: 'true',
      NODE_AUTH_TOKEN: 'fixture-token',
    });
    expect(result.status, result.stderr || result.stdout).toBe(0);
    expect(result.stdout).toContain('no registry mutation');
  });

  it('blocks a local publish even when a token and approval flag are supplied', () => {
    const result = runNode(['tooling/release/publish.mjs'], {
      RELEASE_PUBLISH_APPROVED: 'true',
      NODE_AUTH_TOKEN: 'fixture-token',
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('GitHub Actions release workflow');
  });

  it('does not treat OIDC variables alone as a valid publish runtime', () => {
    const result = runNode(['tooling/release/publish.mjs'], {
      RELEASE_PUBLISH_APPROVED: 'true',
      RELEASE_ENVIRONMENT: 'release',
      ACTIONS_ID_TOKEN_REQUEST_URL: 'https://example.invalid/oidc',
      ACTIONS_ID_TOKEN_REQUEST_TOKEN: 'fixture-token',
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('GitHub Actions release workflow');
  });
});
