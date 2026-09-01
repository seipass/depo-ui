import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { generatedRoot, loadTokenModel, validateContrast, validateTokenModel } from './model.mjs';
import { generateArtifacts } from './build.mjs';

const model = await loadTokenModel();
const errors = [...validateTokenModel(model), ...validateContrast(model)];
const expected = generateArtifacts(model);

for (const [fileName, content] of Object.entries(expected)) {
  try {
    const actual = await readFile(path.join(generatedRoot, fileName), 'utf8');
    if (actual !== content) errors.push(`generated/${fileName} is stale; run pnpm tokens:build`);
  } catch {
    errors.push(`generated/${fileName} is missing; run pnpm tokens:build`);
  }
}

if (errors.length > 0) {
  console.error('Token check failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log(
    'Token check passed: schema, aliases, themes, contrast, and generated artifacts are current.',
  );
}
