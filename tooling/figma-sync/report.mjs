import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot, loadFigmaSource, loadValidatedTokenModel } from './model.mjs';

const model = await loadValidatedTokenModel();
const { collections, componentMapping, tokenMapping } = await loadFigmaSource();
const report = {
  generatedBy: 'tooling/figma-sync/report.mjs',
  version: 1,
  sourceOfTruth: 'repository',
  variables: {
    expected: model.semantic.size,
    mapped: tokenMapping.variables.length,
    modes: collections.collection.modes.map((mode) => mode.id),
  },
  components: {
    mapped: componentMapping.components.length,
    source: componentMapping.source,
  },
  limitations: [
    'No live Figma credentials or remote file are required for CI parity checks.',
    'Figma-to-repository pull is read-only and requires human review before source changes.',
    'Manual publish and screen-level visual parity remain outside this repository-only report.',
  ],
};

await writeFile(
  path.join(repoRoot, 'figma/sync/parity-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);
console.log(`Wrote figma/sync/parity-report.json (${report.variables.mapped} variables).`);
