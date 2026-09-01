import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const sourceRoot = path.join(repoRoot, 'packages/foundations/src/css');
const outputRoot = path.join(repoRoot, 'packages/foundations/dist/css');

await mkdir(outputRoot, { recursive: true });
for (const entry of await readdir(sourceRoot)) {
  if (entry.endsWith('.css')) {
    await copyFile(path.join(sourceRoot, entry), path.join(outputRoot, entry));
  }
}
