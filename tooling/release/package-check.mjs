import { mkdir, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const workspaceRoots = ['packages', 'apps', 'examples'];
const publicPackageNames = new Set(
  JSON.parse(await readFile(path.join(repoRoot, 'governance/release/policy.json'), 'utf8')).publish
    .publicPackages,
);
const requiredMetadata = [
  'name',
  'version',
  'description',
  'license',
  'repository',
  'publishConfig',
  'main',
  'types',
  'files',
  'exports',
  'sideEffects',
];
const forbiddenEntry =
  /(^|\/)(?:src|tests?|__snapshots__|fixtures|specs|governance|\.github)(?:\/|$)|(?:\.test\.|\.stories\.|\.visual\.)|(?:^|\/)(?:\.env(?:\.|$)|\.npmrc$|PLAN\.md$|AGENTS\.md$)/i;

const packagePath = (...parts) => path.join(repoRoot, ...parts);

const run = (command, args, cwd) =>
  spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

const runPnpm = (args, cwd) =>
  run(process.platform === 'win32' ? 'corepack.cmd' : 'corepack', ['pnpm', ...args], cwd);

const readWorkspacePackages = async () => {
  const packages = new Map();
  for (const root of workspaceRoots) {
    const rootDirectory = packagePath(root);
    for (const entry of await readdir(rootDirectory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const directory = path.join(rootDirectory, entry.name);
      try {
        const manifest = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
        packages.set(manifest.name, { directory, manifest, root });
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
  }
  return packages;
};

const runtimeDependencies = (manifest) => [
  ...Object.keys(manifest.dependencies ?? {}),
  ...Object.keys(manifest.optionalDependencies ?? {}),
];

const runtimeClosure = (packages, start) => {
  const closure = new Set();
  const visit = (name) => {
    if (closure.has(name)) return;
    closure.add(name);
    const entry = packages.get(name);
    if (!entry) return;
    for (const dependency of runtimeDependencies(entry.manifest)) {
      if (packages.has(dependency)) visit(dependency);
    }
  };
  visit(start);
  return closure;
};

const isSemverRange = (value) =>
  typeof value === 'string' &&
  /^(?:[<>=~^]*\s*)?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\s+[<>=~^]*\s*\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)*$/.test(
    value,
  );

const packedManifest = (tarball) => {
  const result = run('tar', ['-xOf', tarball, 'package/package.json'], repoRoot);
  if (result.status !== 0) throw new Error(result.stderr || 'could not read packed package.json');
  return JSON.parse(result.stdout);
};

const packedEntries = (tarball) => {
  const result = run('tar', ['-tzf', tarball], repoRoot);
  if (result.status !== 0) throw new Error(result.stderr || 'could not list package tarball');
  return result.stdout.split(/\r?\n/).filter(Boolean);
};

const checkManifest = (entry, packages, errors) => {
  const { manifest, directory } = entry;
  for (const field of requiredMetadata)
    if (
      !Object.hasOwn(manifest, field) ||
      manifest[field] === undefined ||
      manifest[field] === null
    )
      errors.push(`${manifest.name}: missing ${field}`);
  if (manifest.private === true)
    errors.push(`${manifest.name}: public package must not be private`);
  if (manifest.license !== 'MIT') errors.push(`${manifest.name}: license must be MIT`);
  if (manifest.repository?.url !== 'git+https://github.com/seipass/depo-ui.git')
    errors.push(`${manifest.name}: repository URL must point to seipass/depo-ui`);
  if (manifest.repository?.directory !== path.relative(repoRoot, directory))
    errors.push(`${manifest.name}: repository directory does not match package boundary`);
  if (manifest.publishConfig?.access !== 'public')
    errors.push(`${manifest.name}: publish access must be public`);
  if (manifest.publishConfig?.registry !== 'https://registry.npmjs.org/')
    errors.push(`${manifest.name}: publish registry must be npmjs.org`);
  if (manifest.publishConfig?.provenance !== true)
    errors.push(`${manifest.name}: provenance must be enabled for public release`);
  if (
    !Array.isArray(manifest.files) ||
    !manifest.files.includes('README.md') ||
    !manifest.files.includes('LICENSE')
  )
    errors.push(`${manifest.name}: files must include README.md and LICENSE`);
  if (!manifest.exports?.['.'] || !manifest.exports?.['./package.json'])
    errors.push(`${manifest.name}: exports must include the package root and package.json`);
  for (const dependency of runtimeDependencies(manifest)) {
    if (!packages.has(dependency)) continue;
    const range =
      manifest.dependencies?.[dependency] ?? manifest.optionalDependencies?.[dependency];
    if (!range.startsWith('workspace:'))
      errors.push(
        `${manifest.name}: internal runtime dependency ${dependency} must use workspace protocol`,
      );
  }
};

const checkPackedPackage = async (entry, packages, temporaryDirectory, errors) => {
  const packageDestination = path.join(
    temporaryDirectory,
    entry.manifest.name.replace(/^@/, '').replaceAll('/', '-'),
  );
  await mkdir(packageDestination);
  const result = runPnpm(['pack', '--pack-destination', packageDestination], entry.directory);
  if (result.status !== 0) {
    errors.push(`${entry.manifest.name}: pnpm pack failed`);
    return;
  }
  const tarballName = (await readdir(packageDestination))
    .filter((name) => name.endsWith('.tgz'))
    .sort()
    .at(-1);
  if (!tarballName) {
    errors.push(`${entry.manifest.name}: pnpm pack produced no tarball`);
    return;
  }
  const tarball = path.join(packageDestination, tarballName);
  let entries;
  let manifest;
  try {
    entries = packedEntries(tarball);
    manifest = packedManifest(tarball);
  } catch {
    errors.push(`${entry.manifest.name}: packed manifest could not be inspected`);
    return;
  }
  const relativeEntries = entries.map((name) => name.replace(/^package\//, ''));
  for (const name of relativeEntries) {
    if (forbiddenEntry.test(name))
      errors.push(`${entry.manifest.name}: forbidden packed file ${name}`);
  }
  for (const required of ['package.json', 'README.md', 'LICENSE']) {
    if (!relativeEntries.includes(required))
      errors.push(`${entry.manifest.name}: packed package lacks ${required}`);
  }
  const requiredArtifact =
    entry.manifest.name === '@depo-ui/tokens' ? 'generated/tokens.js' : 'dist/index.js';
  if (!relativeEntries.includes(requiredArtifact))
    errors.push(`${entry.manifest.name}: packed package lacks ${requiredArtifact}`);
  if (entry.manifest.name === '@depo-ui/react' && !relativeEntries.includes('dist/css/index.css'))
    errors.push('@depo-ui/react: packed package lacks dist/css/index.css');
  for (const [field, dependencies] of Object.entries({
    ...manifest.dependencies,
    ...manifest.optionalDependencies,
    ...manifest.peerDependencies,
  })) {
    if (
      packages.has(field) &&
      (!isSemverRange(dependencies) || dependencies.startsWith('workspace:'))
    )
      errors.push(
        `${entry.manifest.name}: packed dependency ${field} is not a usable SemVer range`,
      );
  }
};

const main = async () => {
  const packages = await readWorkspacePackages();
  const errors = [];
  const react = packages.get('@depo-ui/react');
  if (!react) errors.push('@depo-ui/react: product-facing package is missing');
  const closure = react ? runtimeClosure(packages, '@depo-ui/react') : new Set();
  if (
    closure.size !== publicPackageNames.size ||
    [...closure].some((name) => !publicPackageNames.has(name))
  )
    errors.push(
      `runtime closure does not match the public package boundary: ${[...closure].sort().join(', ')}`,
    );
  for (const name of publicPackageNames) {
    const entry = packages.get(name);
    if (!entry) {
      errors.push(`${name}: public package is missing from the workspace`);
      continue;
    }
    checkManifest(entry, packages, errors);
  }
  for (const [name, entry] of packages) {
    if (!publicPackageNames.has(name) && entry.manifest.private !== true)
      errors.push(`${name}: non-public workspace package must remain private`);
  }
  const rootManifest = JSON.parse(await readFile(packagePath('package.json'), 'utf8'));
  if (rootManifest.private !== true) errors.push('root workspace must remain private');
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'depo-ui-pack-check-'));
  try {
    for (const name of [...publicPackageNames].sort()) {
      const entry = packages.get(name);
      if (entry) await checkPackedPackage(entry, packages, temporaryDirectory, errors);
    }
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
  if (errors.length) {
    console.error('Release package check failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Release package check passed: ${publicPackageNames.size} public packages, clean packed contents, and SemVer internal dependencies.`,
  );
};

await main();
