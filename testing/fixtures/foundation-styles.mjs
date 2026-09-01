import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const foundationCssFiles = [
  'packages/tokens/generated/tokens.css',
  'packages/foundations/src/css/reset.css',
  'packages/foundations/src/css/theme.css',
  'packages/foundations/src/css/typography.css',
  'packages/foundations/src/css/density.css',
  'packages/foundations/src/css/layout.css',
  'packages/foundations/src/css/motion.css',
];

export async function readFoundationStyles({
  includePrimitives = false,
  includeComponents = false,
} = {}) {
  const files = await Promise.all(
    foundationCssFiles.map(async (relativePath) => {
      const content = await readFile(path.join(repositoryRoot, relativePath), 'utf8');
      return relativePath.endsWith('reset.css')
        ? content.replace("@import '@depo-ui/tokens/css';", '')
        : content;
    }),
  );

  if (includePrimitives) {
    const primitives = await readFile(
      path.join(repositoryRoot, 'packages/primitives/src/css/index.css'),
      'utf8',
    );
    files.push(primitives.replace("@import '@depo-ui/foundations/css';", ''));
  }

  if (includeComponents) {
    const components = await readFile(
      path.join(repositoryRoot, 'packages/components/src/css/index.css'),
      'utf8',
    );
    files.push(
      components
        .replace("@import '@depo-ui/primitives/css';", '')
        .replace("@import '@depo-ui/foundations/css';", ''),
    );
  }

  return files.join('\n');
}
