import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot } from '../token-build/model.mjs';

const sourceDirectory = path.join(repoRoot, 'packages/react/src/css');
const outputDirectory = path.join(repoRoot, 'packages/react/dist/css');

await mkdir(outputDirectory, { recursive: true });
for (const fileName of await readdir(sourceDirectory)) {
  if (!fileName.endsWith('.css') && !fileName.endsWith('.d.ts')) continue;
  await copyFile(path.join(sourceDirectory, fileName), path.join(outputDirectory, fileName));
}
