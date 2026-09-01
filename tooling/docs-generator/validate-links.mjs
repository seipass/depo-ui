import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  generatedContentRoot,
  generatedMarker,
  generatedStaticRoot,
  repoRoot,
} from './metadata-to-mdx.mjs';

const fileExists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const collectFiles = async (directory) => {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(filePath)));
    else files.push(filePath);
  }
  return files;
};

export const validateDocs = async () => {
  const manifestPath = path.join(generatedStaticRoot, 'docs-manifest.json');
  const searchPath = path.join(generatedStaticRoot, 'search.json');
  if (!(await fileExists(manifestPath)) || !(await fileExists(searchPath))) {
    throw new Error('Docs generated manifest or search index is missing. Run pnpm docs:generate.');
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const search = JSON.parse(await readFile(searchPath, 'utf8'));
  const errors = [];
  if (manifest.marker !== generatedMarker) errors.push('manifest marker is stale');
  if (manifest.counts.components !== manifest.components.length)
    errors.push('component count mismatch');
  if (manifest.counts.patterns !== manifest.patterns.length) errors.push('pattern count mismatch');
  if (manifest.counts.searchEntries !== search.length) errors.push('search count mismatch');
  if (new Set(search.map((entry) => entry.path)).size !== search.length)
    errors.push('duplicate search path');
  for (const entry of manifest.components) {
    if (!entry.sourcePath.startsWith('packages/components/src/')) {
      errors.push(`${entry.name} has a non-canonical component source path`);
    }
    if (!(await fileExists(path.join(repoRoot, entry.metadataPath)))) {
      errors.push(`${entry.name} metadata is missing`);
    }
    if (!(await fileExists(path.join(repoRoot, entry.sourcePath)))) {
      errors.push(`${entry.name} source is missing`);
    }
  }
  for (const entry of manifest.patterns) {
    if (!(await fileExists(path.join(repoRoot, entry.metadataPath)))) {
      errors.push(`${entry.name} pattern metadata is missing`);
    }
    if (entry.sourcePath && !(await fileExists(path.join(repoRoot, entry.sourcePath)))) {
      errors.push(`${entry.name} pattern source is missing`);
    }
  }
  const generatedFiles = await collectFiles(generatedContentRoot);
  for (const filePath of generatedFiles) {
    if (
      filePath.endsWith('.mdx') &&
      !(await readFile(filePath, 'utf8')).startsWith(generatedMarker)
    ) {
      errors.push(`${path.relative(repoRoot, filePath)} is missing its generated marker`);
    }
  }
  const preview = await readFile(path.join(generatedStaticRoot, 'docs-preview.html'), 'utf8');
  for (const navigationItem of manifest.navigation) {
    if (!preview.includes(`href="${navigationItem.path}"`)) {
      errors.push(`preview is missing navigation link ${navigationItem.path}`);
    }
  }
  if (
    !preview.includes('<main') ||
    !preview.includes('<h1') ||
    !preview.includes('role="search"')
  ) {
    errors.push('preview is missing required landmark or heading');
  }
  if (errors.length > 0) throw new Error(`Docs validation failed:\n- ${errors.join('\n- ')}`);
  return { manifest, search };
};
