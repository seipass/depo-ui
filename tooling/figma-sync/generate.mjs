import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  repoRoot,
  themeNames,
  loadValidatedTokenModel,
  figmaTypeForToken,
  tokenKey,
  tokenVariableName,
  componentKey,
} from './model.mjs';

const writeJson = async (relativePath, value) => {
  const filePath = path.join(repoRoot, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

async function metadataFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await metadataFiles(entryPath)));
    else if (entry.isFile() && entry.name.endsWith('.json')) files.push(entryPath);
  }
  return files.sort();
}

const model = await loadValidatedTokenModel();
const collections = JSON.parse(
  await readFile(path.join(repoRoot, 'figma/variables/collections.json'), 'utf8'),
);
const componentNaming = JSON.parse(
  await readFile(path.join(repoRoot, 'figma/components/naming.json'), 'utf8'),
);
const semanticTokens = [...model.semantic.values()].map((token) => ({
  collection: collections.collection.key,
  depoUiKey: tokenKey(token.path),
  description: token.description,
  figmaType: figmaTypeForToken(token.type),
  modeIds: collections.collection.modes.map((mode) => mode.id),
  name: tokenVariableName(token.path, collections.tokenNaming.prefix),
  sourcePath: token.sourceFile,
  tier: 'semantic',
  tokenPath: token.path,
}));

const componentMetadata = [];
for (const filePath of await metadataFiles(path.join(repoRoot, 'specs/components'))) {
  componentMetadata.push({
    metadata: JSON.parse(await readFile(filePath, 'utf8')),
    metadataPath: path.relative(repoRoot, filePath).split(path.sep).join('/'),
  });
}

const components = componentMetadata.map(({ metadata, metadataPath }) => ({
  category: metadata.category,
  componentSet: `Depo UI/${metadata.category}/${metadata.name}`,
  depoUiKey: componentKey(metadata.category, metadata.name),
  lifecycle: metadata.lifecycle,
  metadataPath,
  name: metadata.name,
  propertyDefinitions: {
    Variant: { type: componentNaming.propertyTypes.Variant, allowedValues: metadata.variants },
    Size: { type: componentNaming.propertyTypes.Size, allowedValues: metadata.sizes },
    Tone: { type: componentNaming.propertyTypes.Tone, allowedValues: metadata.tones },
    State: { type: componentNaming.propertyTypes.State, allowedValues: metadata.states },
    Lifecycle: {
      type: componentNaming.propertyTypes.Lifecycle,
      allowedValues: [metadata.lifecycle],
    },
  },
  sourcePath: metadata.source,
}));

await writeJson('figma/mapping/tokens.json', {
  $schema: 'https://depo-ui.invalid/schemas/figma-token-mapping.schema.json',
  generatedBy: 'tooling/figma-sync/generate.mjs',
  source: 'packages/tokens/src/semantic',
  collection: collections.collection,
  variables: semanticTokens,
  version: 1,
});
await writeJson('figma/mapping/components.json', {
  $schema: 'https://depo-ui.invalid/schemas/figma-component-mapping.schema.json',
  generatedBy: 'tooling/figma-sync/generate.mjs',
  naming: componentNaming,
  source: 'specs/components',
  components,
  version: 1,
});

console.log(
  `Generated Figma mappings: ${semanticTokens.length} semantic variables, ${components.length} Components, ${themeNames.length} modes.`,
);
