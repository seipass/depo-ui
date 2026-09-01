import { generateDocs } from './metadata-to-mdx.mjs';
import { validateDocs } from './validate-links.mjs';

await generateDocs();
const { manifest, search } = await validateDocs();
console.log(
  `Docs check passed: ${manifest.counts.components} components, ${manifest.counts.patterns} patterns, ${search.length} search entries.`,
);
