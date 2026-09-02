import { access, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getPublishAuthentication } from '../release/auth.mjs';

export const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

const workspaceRoots = ['apps', 'packages', 'examples'];
const validBumps = new Set(['major', 'minor', 'patch']);
const validStatuses = new Set(['proposal', 'trial', 'stable', 'deprecated', 'removed']);

const repoPath = (...parts) => path.join(repoRoot, ...parts);

const exists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const listFiles = async (directory, extension) => {
  const files = [];
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(filePath, extension)));
    else if (!extension || entry.name.endsWith(extension)) files.push(filePath);
  }
  return files.sort();
};

const run = (command, args, options = {}) => {
  const executable = command;
  return spawnSync(executable, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
};

const runPnpm = (args, options = {}) => {
  if (process.platform !== 'win32') return run('pnpm', args, options);
  const quoteWindowsArg = (argument) => {
    const value = String(argument);
    return /[\s"]/.test(value) ? `"${value.replaceAll('"', '\\"')}"` : value;
  };
  const command = ['pnpm.cmd', ...args].map(quoteWindowsArg).join(' ');
  return spawnSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', command], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
};

export const parseChangeset = (content, fileName = 'changeset.md') => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`${fileName}: expected YAML frontmatter delimited by ---`);

  const releases = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const separator = line.indexOf(':');
    if (separator <= 0) throw new Error(`${fileName}: invalid release line "${line}"`);
    const packageName = line
      .slice(0, separator)
      .trim()
      .replace(/^['"]|['"]$/g, '');
    const bump = line
      .slice(separator + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
    if (!packageName || !validBumps.has(bump)) {
      throw new Error(
        `${fileName}: release for ${packageName || '<unknown>'} must use major/minor/patch`,
      );
    }
    if (releases[packageName]) throw new Error(`${fileName}: duplicate package ${packageName}`);
    releases[packageName] = bump;
  }
  if (Object.keys(releases).length === 0) throw new Error(`${fileName}: no packages were released`);
  if (!match[2].trim()) throw new Error(`${fileName}: release summary is empty`);
  return { releases, summary: match[2].trim() };
};

const readChangesets = async () => {
  const directory = repoPath('.changeset');
  const entries = await readdir(directory, { withFileTypes: true });
  const changesets = [];
  const errors = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name === 'README.md') continue;
    const filePath = path.join(directory, entry.name);
    try {
      changesets.push({
        file: filePath,
        ...parseChangeset(await readFile(filePath, 'utf8'), entry.name),
      });
    } catch (error) {
      errors.push(error.message);
    }
  }
  return { changesets, errors };
};

const readWorkspacePackages = async () => {
  const packages = new Map();
  for (const root of workspaceRoots) {
    const rootPath = repoPath(root);
    const entries = await readdir(rootPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const packagePath = path.join(rootPath, entry.name);
      const manifestPath = path.join(packagePath, 'package.json');
      if (!(await exists(manifestPath))) continue;
      const manifest = await readJson(manifestPath);
      packages.set(manifest.name, { manifest, manifestPath, packagePath });
    }
  }
  return packages;
};

const internalDependencies = (manifest, packageNames) =>
  Object.keys({
    ...manifest.dependencies,
    ...manifest.devDependencies,
    ...manifest.optionalDependencies,
    ...manifest.peerDependencies,
  }).filter((name) => packageNames.has(name));

export const findDependencyCycles = (packages) => {
  const packageNames = new Set(packages.keys());
  const graph = new Map(
    [...packages].map(([name, entry]) => [
      name,
      internalDependencies(entry.manifest, packageNames),
    ]),
  );
  const visiting = new Set();
  const visited = new Set();
  const cycles = [];
  const visit = (name, stack = []) => {
    if (visiting.has(name)) {
      const start = stack.indexOf(name);
      cycles.push([...stack.slice(start), name].join(' -> '));
      return;
    }
    if (visited.has(name)) return;
    visiting.add(name);
    for (const dependency of graph.get(name) ?? []) visit(dependency, [...stack, name]);
    visiting.delete(name);
    visited.add(name);
  };
  for (const name of packageNames) visit(name);
  return { graph, cycles };
};

const mergeEvidence = (defaults, override) => ({
  ...defaults,
  ...override,
  reviews: { ...defaults.reviews, ...override?.reviews },
  productionUsage: { ...defaults.productionUsage, ...override?.productionUsage },
  issueSeverity: { ...defaults.issueSeverity, ...override?.issueSeverity },
  adoption: { ...defaults.adoption, ...override?.adoption },
  a11yAudit: { ...defaults.a11yAudit, ...override?.a11yAudit },
});

const isPassingEvidence = (value) =>
  ['approved', 'passed', 'established', 'complete', 'automated'].includes(value);

const validateStableEvidence = (name, metadata, evidence, owners, policy, errors) => {
  if (metadata.lifecycle !== 'stable') return;
  if (!evidence.stableEligible)
    errors.push(`${name}: stableEligible must be true for Stable metadata`);
  for (const gate of policy.stableGate) {
    if (gate === 'owner') continue;
    const value =
      gate === 'productionUsage'
        ? evidence.productionUsage.status
        : gate === 'designReview'
          ? evidence.reviews.design
          : gate === 'apiReview'
            ? evidence.reviews.api
            : gate === 'accessibilityReview'
              ? evidence.reviews.accessibility
              : gate === 'localizationReview'
                ? evidence.localizationReview
                : evidence[gate];
    if (!isPassingEvidence(value))
      errors.push(`${name}: Stable gate ${gate} is ${value || 'missing'}`);
  }
  const owner = owners.aliases[metadata.owner] ?? owners.domains[metadata.owner];
  if (!owner?.primary || !owner.backup || owner.placeholder) {
    errors.push(`${name}: Stable metadata needs non-placeholder primary and backup owners`);
  }
};

const packageForChangedPath = (filePath) => {
  const normalized = filePath.replaceAll('\\', '/');
  const packageMatch = normalized.match(/^packages\/([^/]+)(?:\/|$)/);
  if (packageMatch) return `@depo-ui/${packageMatch[1]}`;
  if (normalized.startsWith('specs/components/')) return '@depo-ui/components';
  if (normalized.startsWith('specs/patterns/')) return '@depo-ui/patterns';
  return undefined;
};

const changedFiles = () => {
  const fromEnvironment = process.env.RELEASE_CHANGED_FILES;
  if (fromEnvironment) return fromEnvironment.split(/[\r\n,]+/).filter(Boolean);
  const baseRef = process.env.RELEASE_BASE_REF;
  if (!baseRef) return [];
  const result = run('git', ['diff', '--name-only', `${baseRef}...HEAD`]);
  return result.status === 0 ? result.stdout.split(/\r?\n/).filter(Boolean) : [];
};

const validateChangesetRequirement = (changesets, packages, errors) => {
  if (process.env.RELEASE_CHECK_REQUIRE_CHANGESET !== 'true') return;
  const changed = changedFiles();
  const releaseablePackages = new Set(changed.map(packageForChangedPath).filter(Boolean));
  if (releaseablePackages.size === 0) return;
  const changedByChangeset = new Set(
    changesets.flatMap((changeset) => Object.keys(changeset.releases)),
  );
  for (const packageName of releaseablePackages) {
    if (packages.has(packageName) && !changedByChangeset.has(packageName)) {
      errors.push(`${packageName}: releaseable source changed without a Changeset`);
    }
  }
};

const validatePolicy = async (packages, errors) => {
  const policy = await readJson(repoPath('governance/lifecycle/policy.json'));
  const owners = await readJson(repoPath('governance/ownership/owners.json'));
  const evidenceRegistry = await readJson(repoPath('governance/evidence/components.json'));
  const releasePolicy = await readJson(repoPath('governance/release/policy.json'));
  const changesetConfig = await readJson(repoPath('.changeset/config.json'));
  const migrations = await readJson(repoPath('governance/migrations/registry.json'));

  if (!policy.statuses.every((status) => validStatuses.has(status)))
    errors.push('lifecycle policy has an unknown status');
  const statusSet = new Set(policy.statuses);
  for (const transition of policy.transitions) {
    if (!statusSet.has(transition.from) || !statusSet.has(transition.to)) {
      errors.push(`lifecycle transition is unknown: ${transition.from} -> ${transition.to}`);
    }
  }
  const requiredStableGate = [
    'designReview',
    'apiReview',
    'accessibilityReview',
    'keyboardTest',
    'screenReaderTest',
    'responsiveReview',
    'themeReview',
    'reducedMotionReview',
    'localizationReview',
    'visualRegression',
    'figmaCodeParity',
    'productionUsage',
    'owner',
  ];
  for (const gate of requiredStableGate) {
    if (!policy.stableGate.includes(gate)) errors.push(`stable gate is missing ${gate}`);
  }
  if (policy.minimumDeprecatedReleaseWindows < 2)
    errors.push('deprecated support window must span two releases');
  if (releasePolicy.baseBranch !== changesetConfig.baseBranch) {
    errors.push('release policy and Changesets baseBranch differ');
  }
  if (changesetConfig.privatePackages?.version !== true) {
    errors.push('Changesets must version private workspace packages for graph verification');
  }

  const componentFiles = await listFiles(repoPath('specs/components'), '.json');
  const componentNames = new Set();
  for (const filePath of componentFiles) {
    const metadata = await readJson(filePath);
    const name = metadata.name;
    if (!name || componentNames.has(name)) {
      errors.push(`${path.relative(repoRoot, filePath)}: Component name is missing or duplicated`);
      continue;
    }
    componentNames.add(name);
    if (!validStatuses.has(metadata.lifecycle))
      errors.push(`${name}: unknown lifecycle ${metadata.lifecycle}`);
    if (!metadata.owner || !(owners.aliases[metadata.owner] ?? owners.domains[metadata.owner])) {
      errors.push(`${name}: owner ${metadata.owner || '<missing>'} is not registered`);
    }
    if (!metadata.source?.startsWith('packages/components/src/')) {
      errors.push(`${name}: source must remain below packages/components/src/`);
    }
    const evidence = mergeEvidence(evidenceRegistry.defaults, evidenceRegistry.overrides[name]);
    for (const evidencePath of evidence.a11yAudit.evidence) {
      if (!(await exists(repoPath(evidencePath))))
        errors.push(`${name}: missing evidence ${evidencePath}`);
    }
    validateStableEvidence(name, metadata, evidence, owners, policy, errors);
    if (metadata.lifecycle === 'deprecated' || metadata.lifecycle === 'removed') {
      const migration = migrations.migrations.find(
        (entry) => entry.component === name && ['active', 'complete'].includes(entry.status),
      );
      if (!migration)
        errors.push(`${name}: ${metadata.lifecycle} requires an active migration entry`);
    }
  }
  for (const name of Object.keys(evidenceRegistry.overrides)) {
    if (!componentNames.has(name))
      errors.push(`evidence override has no Component metadata: ${name}`);
  }

  const migrationIds = new Set();
  for (const migration of migrations.migrations) {
    if (migrationIds.has(migration.id)) errors.push(`duplicate migration id: ${migration.id}`);
    migrationIds.add(migration.id);
    if (migration.fromProp === migration.toProp)
      errors.push(`${migration.id}: migration must change the property name`);
    if (!(await exists(repoPath('tooling/codemods/run.mjs'))))
      errors.push('codemod runner is missing');
  }

  return { policy, releasePolicy, migrations, componentCount: componentNames.size };
};

const validateChangesetsAndGraph = async (packages, errors) => {
  const { changesets, errors: changesetErrors } = await readChangesets();
  errors.push(...changesetErrors);
  const packageNames = new Set(packages.keys());
  for (const changeset of changesets) {
    for (const packageName of Object.keys(changeset.releases)) {
      if (!packageNames.has(packageName))
        errors.push(`${path.basename(changeset.file)}: unknown package ${packageName}`);
    }
  }
  const { graph, cycles } = findDependencyCycles(packages);
  for (const cycle of cycles) errors.push(`dependency cycle: ${cycle}`);
  for (const [packageName, entry] of packages) {
    const allDependencies = {
      ...entry.manifest.dependencies,
      ...entry.manifest.devDependencies,
      ...entry.manifest.optionalDependencies,
      ...entry.manifest.peerDependencies,
    };
    for (const dependencyName of graph.get(packageName) ?? []) {
      const range = allDependencies[dependencyName];
      if (!range.startsWith('workspace:')) {
        errors.push(
          `${packageName}: internal dependency ${dependencyName} must use workspace protocol`,
        );
      }
    }
  }
  validateChangesetRequirement(changesets, packages, errors);
  return changesets;
};

const validatePackedInstall = async (errors) => {
  if (process.env.RELEASE_CHECK_SKIP_PACK === 'true') return;
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'depo-ui-release-'));
  const packDirectory = path.join(tempRoot, 'pack');
  const consumerDirectory = path.join(tempRoot, 'consumer');
  await Promise.all([mkdir(packDirectory), mkdir(consumerDirectory)]);
  try {
    const pack = runPnpm(['pack', '--pack-destination', packDirectory], {
      cwd: repoPath('packages/tokens'),
    });
    if (pack.status !== 0) {
      errors.push(
        `packed package failed: ${pack.error?.message || pack.stderr || pack.stdout}`.trim(),
      );
      return;
    }
    const tarball = (await readdir(packDirectory)).find((entry) => entry.endsWith('.tgz'));
    if (!tarball) {
      errors.push('packed package did not produce a tarball');
      return;
    }
    const tarballPath = path.join(packDirectory, tarball);
    await writeFile(
      path.join(consumerDirectory, 'package.json'),
      JSON.stringify(
        {
          name: 'depo-ui-release-consumer',
          private: true,
          type: 'module',
          dependencies: { '@depo-ui/tokens': `file:${tarballPath}` },
        },
        null,
        2,
      ),
    );
    const install = runPnpm(['install', '--ignore-scripts', '--offline'], {
      cwd: consumerDirectory,
    });
    if (install.status !== 0) {
      errors.push(
        `packed package install failed: ${install.error?.message || install.stderr || install.stdout}`.trim(),
      );
      return;
    }
    const manifestPath = path.join(
      consumerDirectory,
      'node_modules',
      '@depo-ui',
      'tokens',
      'generated',
      'manifest.json',
    );
    if (!(await exists(manifestPath)))
      errors.push('packed package install has no public generated manifest');
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
};

const main = async () => {
  const errors = [];
  const packages = await readWorkspacePackages();
  const governance = await validatePolicy(packages, errors);
  const changesets = await validateChangesetsAndGraph(packages, errors);
  await validatePackedInstall(errors);
  if (process.argv.includes('--publish')) {
    if (process.env.RELEASE_PUBLISH_APPROVED !== 'true') {
      errors.push(
        'publish requires RELEASE_PUBLISH_APPROVED=true in the protected release environment',
      );
    }
    const authentication = getPublishAuthentication(process.env, governance.releasePolicy);
    if (!authentication.allowed) {
      errors.push(
        'publish requires the protected GitHub Actions release workflow with OIDC Trusted Publishing or a bootstrap npm token',
      );
    }
    for (const [name, entry] of packages) {
      if (
        !entry.manifest.private &&
        changesets.some((changeset) => Object.hasOwn(changeset.releases, name))
      )
        continue;
      if (changesets.some((changeset) => Object.hasOwn(changeset.releases, name))) {
        errors.push(
          `publish candidate ${name} is private; make it explicitly publishable before release`,
        );
      }
    }
  }
  if (errors.length) {
    console.error('Governance check failed:');
    for (const error of errors) console.error('- ' + error);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Governance check passed: ${governance.componentCount} Component metadata entries, ${changesets.length} Changesets, cycle-free version graph, migration registry, and packed package install.`,
  );
};

await main();
