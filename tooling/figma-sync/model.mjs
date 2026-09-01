import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  loadTokenModel,
  repoRoot,
  resolvedTheme,
  themeNames,
  validateTokenModel,
} from '../token-build/model.mjs';

export { repoRoot, themeNames };

export const figmaTypeForToken = (type) => {
  if (type === 'color') return 'COLOR';
  if (type === 'boolean') return 'BOOLEAN';
  if (type === 'fontFamily' || type === 'string') return 'STRING';
  return 'FLOAT';
};

export const tokenVariableName = (tokenPath, prefix = 'Depo UI/Variables/') =>
  `${prefix}${tokenPath.replace(/[._]/g, '/')}`;

export const tokenKey = (tokenPath) => `semantic.token.${tokenPath}`;

export const componentKey = (category, name) => `component.${category}.${name}`;

export const readJson = async (relativePath) =>
  JSON.parse(await readFile(path.join(repoRoot, relativePath), 'utf8'));

export async function loadFigmaSource() {
  const [collections, componentNaming, syncPolicy, tokenMapping, componentMapping] =
    await Promise.all([
      readJson('figma/variables/collections.json'),
      readJson('figma/components/naming.json'),
      readJson('figma/sync/policy.json'),
      readJson('figma/mapping/tokens.json'),
      readJson('figma/mapping/components.json'),
    ]);
  return { collections, componentNaming, componentMapping, syncPolicy, tokenMapping };
}

export function createExpectedSnapshot({ model, tokenMapping, componentMapping }) {
  const resolvedByTheme = new Map(
    themeNames.map((themeName) => [themeName, resolvedTheme(model, themeName)]),
  );
  const variables = tokenMapping.variables.map((variable) => ({
    ...variable,
    modes: Object.fromEntries(
      themeNames.map((themeName) => [
        themeName,
        resolvedByTheme.get(themeName)?.get(variable.tokenPath)?.value,
      ]),
    ),
  }));

  return { components: componentMapping.components, variables };
}

const identityOf = (entry) => entry.depoUiKey ?? entry.sourcePath ?? entry.tokenPath ?? entry.name;

const comparableEntry = (entry) => {
  const comparable = { ...entry };
  delete comparable.depoUiKey;
  delete comparable.name;
  return comparable;
};

export function diffEntries(expectedEntries, actualEntries) {
  const actualByKey = new Map(actualEntries.map((entry) => [entry.depoUiKey, entry]));
  const actualBySourcePath = new Map(
    actualEntries.filter((entry) => entry.sourcePath).map((entry) => [entry.sourcePath, entry]),
  );
  const actualByTokenPath = new Map(
    actualEntries.filter((entry) => entry.tokenPath).map((entry) => [entry.tokenPath, entry]),
  );
  const actualByIdentity = new Map(actualEntries.map((entry) => [identityOf(entry), entry]));
  const matchedActual = new Set();
  const missing = [];
  const renamed = [];
  const changed = [];

  for (const expected of expectedEntries) {
    const actual =
      actualByKey.get(expected.depoUiKey) ??
      (expected.sourcePath ? actualBySourcePath.get(expected.sourcePath) : undefined) ??
      (expected.tokenPath ? actualByTokenPath.get(expected.tokenPath) : undefined) ??
      actualByIdentity.get(identityOf(expected));
    if (!actual) {
      missing.push(expected);
      continue;
    }
    matchedActual.add(actual);
    if (actual.name !== expected.name)
      renamed.push({ key: expected.depoUiKey, from: expected.name, to: actual.name });
    if (JSON.stringify(comparableEntry(expected)) !== JSON.stringify(comparableEntry(actual))) {
      changed.push({ expected, actual });
    }
  }

  const extra = actualEntries.filter((entry) => !matchedActual.has(entry));
  return { changed, extra, missing, renamed };
}

export function diffFigmaSnapshot(expected, actual = { variables: [], components: [] }) {
  const variables = diffEntries(expected.variables, actual.variables ?? []);
  const components = diffEntries(expected.components, actual.components ?? []);
  return {
    components,
    hasChanges: [variables, components].some((diff) =>
      Object.values(diff).some((entries) => entries.length > 0),
    ),
    variables,
  };
}

export function hasFigmaCredentials(environment = process.env) {
  return Boolean(environment.FIGMA_ACCESS_TOKEN && environment.FIGMA_FILE_KEY);
}

export function selectSyncTransport({ environment = process.env } = {}) {
  if (hasFigmaCredentials(environment) && environment.FIGMA_API_URL) {
    return {
      name: 'rest',
      writable: true,
      reason: 'Explicit REST endpoint and credentials are present.',
    };
  }
  return {
    name: 'plugin-api',
    writable: false,
    reason: 'REST is unavailable; an explicit Figma Plugin API adapter is required for publish.',
  };
}

export function createSyncPlan({
  expected,
  actual = { variables: [], components: [] },
  direction = 'push',
  dryRun = true,
  environment = process.env,
} = {}) {
  if (direction !== 'push' && direction !== 'pull')
    throw new Error(`Unsupported Figma sync direction: ${direction}`);
  const diff = diffFigmaSnapshot(expected, actual);
  const transport = selectSyncTransport({ environment });
  const operations = [];

  if (direction === 'push') {
    for (const entry of [...diff.variables.missing, ...diff.components.missing]) {
      operations.push({ action: 'create', key: entry.depoUiKey });
    }
    for (const entry of [...diff.variables.changed, ...diff.components.changed]) {
      operations.push({ action: 'update', key: entry.expected.depoUiKey });
    }
    for (const entry of [...diff.variables.renamed, ...diff.components.renamed]) {
      operations.push({ action: 'rename', ...entry });
    }
    for (const entry of [...diff.variables.extra, ...diff.components.extra]) {
      operations.push({ action: 'review-extra', key: entry.depoUiKey ?? entry.name });
    }
  }

  return {
    canApply: direction === 'push' && !dryRun && transport.writable,
    direction,
    dryRun,
    operations,
    readOnly: direction === 'pull',
    transport: { name: transport.name, writable: transport.writable },
    diff,
  };
}

export async function loadValidatedTokenModel() {
  const model = await loadTokenModel();
  const errors = validateTokenModel(model);
  if (errors.length > 0) throw new Error(errors.join('\n'));
  return model;
}
