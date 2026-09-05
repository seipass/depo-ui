import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot, loadFigmaSource, loadValidatedTokenModel } from './model.mjs';

const model = await loadValidatedTokenModel();
const { collections, componentMapping, componentNaming, syncPolicy, tokenMapping } =
  await loadFigmaSource();
const report = JSON.parse(
  await readFile(path.join(repoRoot, 'figma/sync/parity-report.json'), 'utf8'),
);
const errors = [];
const expectedModes = ['dark'];

if (collections.sourceOfTruth !== 'packages/tokens/src')
  errors.push('Figma variables must use token JSON as Source of Truth.');
if (
  JSON.stringify(collections.collection.modes.map((mode) => mode.id)) !==
  JSON.stringify(expectedModes)
) {
  errors.push('Figma must expose the single Dark appearance mode.');
}
if (tokenMapping.variables.length !== model.semantic.size)
  errors.push('Every Semantic token must have exactly one Figma mapping.');
if (
  new Set(tokenMapping.variables.map((variable) => variable.depoUiKey)).size !==
  tokenMapping.variables.length
) {
  errors.push('Figma token mapping keys must be unique.');
}
for (const variable of tokenMapping.variables) {
  if (variable.tier !== 'semantic') errors.push(`${variable.depoUiKey} is not a Semantic mapping.`);
  if (JSON.stringify(variable).match(/"(?:\$value|value|values)"\s*:/)) {
    errors.push(`${variable.depoUiKey} must not copy token values into the mapping.`);
  }
  if (JSON.stringify(variable.modeIds) !== JSON.stringify(expectedModes)) {
    errors.push(`${variable.depoUiKey} is missing a Figma mode.`);
  }
}
if (componentMapping.components.length === 0) errors.push('Component mapping cannot be empty.');
if (
  new Set(componentMapping.components.map((component) => component.depoUiKey)).size !==
  componentMapping.components.length
) {
  errors.push('Figma Component mapping keys must be unique.');
}
for (const component of componentMapping.components) {
  if (!component.sourcePath.startsWith('packages/components/src/')) {
    errors.push(`${component.depoUiKey} must point below packages/components/src/.`);
  }
  for (const propertyName of Object.values(componentNaming.propertyNames)) {
    if (!component.propertyDefinitions[propertyName])
      errors.push(`${component.depoUiKey} is missing ${propertyName}.`);
  }
}
if (syncPolicy.sourceOfTruth !== 'repository' || syncPolicy.publish.dryRunDefault !== true) {
  errors.push('Figma sync must remain repository-first and dry-run by default.');
}
if (report.generatedBy !== 'tooling/figma-sync/report.mjs')
  errors.push('Figma parity report is stale or hand-edited.');
if (report.variables.mapped !== model.semantic.size)
  errors.push('Figma parity report has a stale variable count.');
for (const relativePath of [
  'figma/variables/collections.json',
  'figma/components/naming.json',
  'figma/mapping/tokens.json',
  'figma/mapping/components.json',
  'figma/sync/parity-report.json',
]) {
  await access(path.join(repoRoot, relativePath));
}

if (errors.length > 0) throw new Error(errors.join('\n'));
console.log(
  `Figma mapping check passed (${tokenMapping.variables.length} variables, ${componentMapping.components.length} Components).`,
);
