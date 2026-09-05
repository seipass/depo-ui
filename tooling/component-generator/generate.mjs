import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot } from '../token-build/model.mjs';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const argument = process.argv[index];
  if (!argument.startsWith('--')) continue;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) {
    args.set(argument.slice(2), true);
  } else {
    args.set(argument.slice(2), value);
    index += 1;
  }
}

const name = String(args.get('name') ?? '');
const category = String(args.get('category') ?? '');
const metadataOnly = args.get('metadata-only') === true || args.get('metadata-only') === 'true';
const force = args.get('force') === true || args.get('force') === 'true';
const validName = /^[A-Z][A-Za-z0-9]*$/.test(name);
const validCategory = /^[a-z][a-z-]*$/.test(category);

if (!validName || !validCategory) {
  console.error(
    'Usage: pnpm generate -- --name Button --category actions [--metadata-only] [--force]',
  );
  process.exitCode = 1;
} else {
  const sourceDirectory = path.join(repoRoot, 'packages/components/src', category, name);
  const specDirectory = path.join(repoRoot, 'specs/components', category);
  const metadata = {
    name,
    category,
    source: `packages/components/src/${category}/${name}`,
    lifecycle: 'trial',
    owner: 'depo-ui-maintainers',
    purpose: `${name} provides a reusable Depo UI ${name.toLowerCase()} interaction or display primitive.`,
    anatomy: ['root'],
    variants: ['solid', 'soft', 'outline', 'ghost', 'link'],
    sizes: ['sm', 'md', 'lg'],
    tones: ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger'],
    states: ['rest', 'hover', 'pressed', 'focus-visible', 'disabled', 'loading', 'invalid'],
    props: ['variant', 'size', 'tone', 'disabled', 'loading'],
    events: ['onClick', 'onChange'],
    keyboardBehavior:
      'Preserve native keyboard behavior unless the component contract defines a composite interaction.',
    focusBehavior:
      'Expose a DOM ref only when a consumer has a documented focus or measurement target.',
    semanticHtml: 'Use the most specific native element available.',
    aria: 'Use native semantics first; add ARIA only where the contract requires it.',
    contentRules: 'Use concise, actionable labels and allow long content to wrap.',
    responsiveBehavior:
      'Adapt within the available container without relying only on viewport width.',
    densityBehavior: 'Support compact, comfortable, and touch density through semantic tokens.',
    themeBehavior:
      'Consume semantic tokens for the standard dark appearance; preserve OS forced-colors overrides.',
    loadingBehavior: 'Loading is explicit and must prevent duplicate actions when applicable.',
    errorBehavior: 'Describe what went wrong and preserve the user input where possible.',
    recoveryBehavior: 'Offer a nearby retry, correction, or alternate action when recovery exists.',
    accessibility: 'WCAG 2.2 AA is part of the implementation contract.',
    tests: [
      'unit',
      'interaction',
      'keyboard',
      'accessibility',
      'visual',
      'theme',
      'responsive',
      'localization',
    ],
  };
  const metadataFile = path.join(specDirectory, `${name}.json`);

  if (metadataOnly) {
    await mkdir(specDirectory, { recursive: true });
    if (!force) {
      try {
        await readFile(metadataFile, 'utf8');
        console.error(`Refusing to overwrite ${metadataFile}; use --force.`);
        process.exitCode = 1;
      } catch {
        await writeFile(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
      }
    } else {
      await writeFile(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
    }
  } else {
    await mkdir(sourceDirectory, { recursive: true });
    const files = {
      [`${name}.types.ts`]: `import type { ComponentPropsWithRef } from 'react';\n\nexport type ${name}Props = ComponentPropsWithRef<'div'>;\n`,
      [`${name}.styles.ts`]: `export const ${name[0].toLowerCase() + name.slice(1)}ClassName = 'dui-${name.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase()).replace(/^-/, '')}';\n`,
      [`${name}.tokens.ts`]: `export const ${name[0].toLowerCase() + name.slice(1)}Tokens = {} as const;\n`,
      [`${name}.tsx`]: `import type { ${name}Props } from './${name}.types.js';\n\nexport function ${name}(props: ${name}Props) {\n  return <div {...props} />;\n}\n`,
      [`${name}.test.tsx`]: `import { describe, it } from 'vitest';\n\ndescribe('${name}', () => {\n  it.todo('covers the public contract');\n});\n`,
      [`${name}.a11y.test.tsx`]: `import { describe, it } from 'vitest';\n\ndescribe('${name} accessibility', () => {\n  it.todo('covers keyboard, focus, and WCAG 2.2 AA behavior');\n});\n`,
      [`${name}.visual.tsx`]: `import type { ${name}Props } from './${name}.types.js';\n\nexport function ${name}VisualFixture(props: ${name}Props) {\n  return <div data-visual-fixture="${name}"><div {...props} /></div>;\n}\n`,
      [`${name}.stories.tsx`]: `export default { title: 'Depo UI/${category}/${name}' };\n`,
      'index.ts': `export { ${name} } from './${name}.js';\nexport type { ${name}Props } from './${name}.types.js';\n`,
    };
    for (const [fileName, contents] of Object.entries(files)) {
      const filePath = path.join(sourceDirectory, fileName);
      if (!force) {
        try {
          await readFile(filePath, 'utf8');
          console.error(`Refusing to overwrite ${filePath}; use --force.`);
          process.exitCode = 1;
          continue;
        } catch {
          // The file does not exist and can be generated.
        }
      }
      await writeFile(filePath, contents, 'utf8');
    }
    await mkdir(specDirectory, { recursive: true });
    await writeFile(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
  }
}
