import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot } from '../token-build/model.mjs';

const roots = [
  'packages/foundations/src',
  'packages/primitives/src',
  'packages/components/src',
  'packages/patterns/src',
  'packages/react/src',
  'apps',
  'examples',
];
const sourceExtensions = new Set(['.css', '.scss', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const ignoredSegments = new Set([
  'node_modules',
  'dist',
  'generated',
  '.turbo',
  '.docusaurus',
  'build',
  'snapshots',
]);
const violations = [];

const walk = async (directory) => {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (ignoredSegments.has(entry.name)) continue;
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(filePath);
    else if (sourceExtensions.has(path.extname(entry.name))) {
      const content = await readFile(filePath, 'utf8');
      const relativePath = path.relative(repoRoot, filePath);
      const lines = content.split(/\r?\n/);
      lines.forEach((line, index) => {
        if (line.includes('dui-raw-value-allow')) return;
        if (/(?:^|[^\w-])#[0-9a-f]{3,8}\b/i.test(line))
          violations.push(`${relativePath}:${index + 1}: raw color literal`);
        if (/(?:^|[^\w-])\d+(?:\.\d+)?px\b/i.test(line))
          violations.push(`${relativePath}:${index + 1}: raw px value`);
        if (/(?:rgb|hsl)a?\(/i.test(line))
          violations.push(`${relativePath}:${index + 1}: raw color function`);
      });
    }
  }
};

for (const root of roots) await walk(path.join(repoRoot, root));

if (violations.length > 0) {
  console.error('Raw value lint failed:');
  for (const violation of violations) console.error('- ' + violation);
  process.exitCode = 1;
} else {
  console.log(
    'Raw value lint passed: no unapproved color or pixel literals in product-facing source.',
  );
}
