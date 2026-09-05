import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { generateDocs } from './metadata-to-mdx.mjs';

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const { model } = await generateDocs();
  console.log(
    `Docs generated: ${model.components.length} components, ${model.patterns.length} patterns, ${model.tokens.appearance} appearance.`,
  );
}

export { generateDocs };
