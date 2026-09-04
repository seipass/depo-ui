import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPublishAuthentication } from './auth.mjs';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const policy = JSON.parse(
  await readFile(path.join(repoRoot, 'governance/release/policy.json'), 'utf8'),
);
const registry = policy.registry.replace(/\/+$/, '');
const publicPackageNames = new Set(policy.publish.publicPackages);
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const runtimeDependencies = (manifest) => [
  ...Object.keys(manifest.dependencies ?? {}),
  ...Object.keys(manifest.optionalDependencies ?? {}),
];

const readPublicPackages = async () => {
  const packagesDirectory = path.join(repoRoot, 'packages');
  const entries = new Map();
  for (const directoryEntry of await readdir(packagesDirectory, { withFileTypes: true })) {
    if (!directoryEntry.isDirectory()) continue;
    const directory = path.join(packagesDirectory, directoryEntry.name);
    try {
      const manifest = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
      if (publicPackageNames.has(manifest.name))
        entries.set(manifest.name, { directory, manifest });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return entries;
};

const isPublished = async (name, version) => {
  const response = await globalThis.fetch(`${registry}/${encodeURIComponent(name)}`, {
    headers: { accept: 'application/json' },
  });
  if (response.status === 404) return false;
  if (!response.ok)
    throw new Error(`could not inspect ${name} in the npm registry (${response.status})`);
  const packument = await response.json();
  return Object.hasOwn(packument.versions ?? {}, version);
};

const orderForPublish = (entries, candidates) => {
  const remaining = new Set(candidates.map((candidate) => candidate.manifest.name));
  const ordered = [];
  while (remaining.size > 0) {
    const ready = [...remaining]
      .filter((name) => {
        const dependencies = runtimeDependencies(entries.get(name).manifest);
        return dependencies.every((dependency) => !remaining.has(dependency));
      })
      .sort();
    if (ready.length === 0) throw new Error('public package publish graph contains a cycle');
    for (const name of ready) {
      ordered.push(entries.get(name));
      remaining.delete(name);
    }
  }
  return ordered;
};

const pack = (entry, destination, environment) => {
  const packageDestination = path.join(
    destination,
    entry.manifest.name.replace(/^@/, '').replaceAll('/', '-'),
  );
  const result = spawnSync(
    pnpmCommand,
    ['pack', '--pack-destination', packageDestination, '--json'],
    {
      cwd: entry.directory,
      encoding: 'utf8',
      env: environment,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  if (result.status !== 0)
    throw new Error(
      `pnpm pack failed for ${entry.manifest.name}: ${result.stderr.trim() || 'unknown error'}`,
    );
  let metadata;
  try {
    metadata = JSON.parse(result.stdout);
  } catch {
    throw new Error(`pnpm pack returned invalid metadata for ${entry.manifest.name}`);
  }
  if (metadata.name !== entry.manifest.name || metadata.version !== entry.manifest.version)
    throw new Error(`pnpm pack metadata does not match ${entry.manifest.name}`);
  if (!metadata.filename)
    throw new Error(`pnpm pack produced no tarball for ${entry.manifest.name}`);
  return metadata.filename;
};

const publish = (entry, destination) => {
  const access = entry.manifest.publishConfig?.access ?? 'public';
  const packageRegistry = entry.manifest.publishConfig?.registry ?? `${registry}/`;
  const environment = { ...process.env, NPM_CONFIG_PROVENANCE: 'true' };
  delete environment.NODE_AUTH_TOKEN;
  delete environment.NPM_TOKEN;
  const tarball = pack(entry, destination, environment);
  const result = spawnSync(
    npmCommand,
    ['publish', tarball, '--access', access, '--provenance', '--registry', packageRegistry],
    { cwd: repoRoot, env: environment, stdio: 'inherit' },
  );
  if (result.status !== 0) throw new Error(`npm publish failed for ${entry.manifest.name}`);
  console.log(
    `Published ${entry.manifest.name}@${entry.manifest.version} through npm OIDC backend.`,
  );
};

const main = async () => {
  if (process.env.RELEASE_PUBLISH_APPROVED !== 'true')
    throw new Error('RELEASE_PUBLISH_APPROVED=true is required');
  const authentication = getPublishAuthentication(process.env, policy);
  if (!authentication.runtime || !authentication.oidc)
    throw new Error('npm OIDC publishing requires the protected GitHub Actions runtime');
  if (authentication.bootstrapToken)
    throw new Error('npm OIDC publishing refuses NODE_AUTH_TOKEN and NPM_TOKEN');

  const entries = await readPublicPackages();
  for (const name of publicPackageNames) {
    const entry = entries.get(name);
    if (!entry) throw new Error(`public package is missing from the workspace: ${name}`);
    if (entry.manifest.private === true) throw new Error(`public package is private: ${name}`);
  }

  const candidates = [];
  for (const entry of entries.values()) {
    if (!(await isPublished(entry.manifest.name, entry.manifest.version))) candidates.push(entry);
  }
  if (candidates.length === 0) {
    console.log('No unpublished public package versions were found.');
    return;
  }

  const ordered = orderForPublish(entries, candidates);
  console.log(
    `OIDC npm publish plan: ${ordered.map((entry) => `${entry.manifest.name}@${entry.manifest.version}`).join(', ')}`,
  );
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'depo-ui-oidc-publish-'));
  try {
    for (const entry of ordered) publish(entry, temporaryDirectory);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
};

try {
  await main();
} catch (error) {
  console.error(
    `OIDC npm publish blocked: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
}
