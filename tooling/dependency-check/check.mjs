import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const workspaceRoots = ['apps', 'packages', 'examples'];
const componentCategories = [
  'actions',
  'forms',
  'selection',
  'navigation',
  'data-display',
  'feedback',
  'overlays',
  'disclosure',
];
const errors = [];

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const exists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const packageFiles = [];
for (const root of workspaceRoots) {
  const rootPath = path.join(repoRoot, root);
  const entries = await readdir(rootPath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const packageFile = path.join(rootPath, entry.name, 'package.json');
    if (await exists(packageFile)) packageFiles.push(packageFile);
  }
}

const packages = new Map();
for (const packageFile of packageFiles) {
  const manifest = await readJson(packageFile);
  if (!manifest.name) errors.push(packageFile + ': missing name');
  if (packages.has(manifest.name)) errors.push('duplicate package name: ' + manifest.name);
  packages.set(manifest.name, { manifest, packageFile });
}

const rootManifest = await readJson(path.join(repoRoot, 'package.json'));
if (rootManifest.packageManager !== 'pnpm@11.25.0') {
  errors.push('root packageManager must be pnpm@11.25.0');
}
if (!rootManifest.engines?.node?.includes('24.19.0')) {
  errors.push('root engines.node must include the Phase 0 Node baseline');
}
if (!rootManifest.engines?.pnpm?.includes('11.25.0')) {
  errors.push('root engines.pnpm must include the Phase 0 pnpm baseline');
}

const rules = await readJson(path.join(repoRoot, 'tooling/dependency-check/rules.json'));
const internalNames = new Set(packages.keys());
const internalGraph = new Map();
for (const packageName of internalNames) {
  if (!Object.hasOwn(rules.allowedInternalDependencies, packageName)) {
    errors.push('missing dependency rule for ' + packageName);
  }
}

for (const [packageName, entry] of packages) {
  const manifest = entry.manifest;
  const allDependencies = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
    ...manifest.optionalDependencies,
    ...manifest.peerDependencies,
  };
  internalGraph.set(
    packageName,
    Object.keys(allDependencies).filter((dependencyName) => internalNames.has(dependencyName)),
  );
  const allowed = new Set(rules.allowedInternalDependencies[packageName] ?? []);
  for (const dependencyName of Object.keys(allDependencies)) {
    if (internalNames.has(dependencyName) && !allowed.has(dependencyName)) {
      errors.push(packageName + ' has forbidden internal dependency ' + dependencyName);
    }
  }

  if (entry.packageFile.includes(path.join(repoRoot, 'packages'))) {
    if (!manifest.exports || !manifest.exports['.']) {
      errors.push(packageName + ' must declare a package-root export');
    }
    if (JSON.stringify(manifest.exports).includes('/src')) {
      errors.push(packageName + ' must not expose src through exports');
    }
  }
}

const visiting = new Set();
const visited = new Set();
const visit = (packageName, stack = []) => {
  if (visiting.has(packageName)) {
    const cycleStart = stack.indexOf(packageName);
    const cycle = [...stack.slice(cycleStart), packageName].join(' -> ');
    errors.push('dependency cycle: ' + cycle);
    return;
  }
  if (visited.has(packageName)) return;

  visiting.add(packageName);
  for (const dependencyName of internalGraph.get(packageName) ?? []) {
    visit(dependencyName, [...stack, packageName]);
  }
  visiting.delete(packageName);
  visited.add(packageName);
};

for (const packageName of internalNames) visit(packageName);

const componentsRoot = path.join(repoRoot, 'packages/components');
const componentSourceRoot = path.join(componentsRoot, 'src');
for (const category of componentCategories) {
  if (!(await exists(path.join(componentSourceRoot, category)))) {
    errors.push('missing component source directory packages/components/src/' + category);
  }
  if (await exists(path.join(componentsRoot, category))) {
    errors.push('legacy component source directory exists at packages/components/' + category);
  }
}

if (errors.length > 0) {
  console.error('Dependency check failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log(
    'Dependency check passed: ' +
      packages.size +
      ' workspace packages, explicit internal edges, cycle-free graph, package exports, and component source boundaries.',
  );
}
