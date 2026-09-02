import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const policy = JSON.parse(
  await readFile(path.join(repoRoot, 'governance/release/policy.json'), 'utf8'),
);
const publicPackages = policy.publish.publicPackages;

const run = (command, args, cwd, { quiet = false } = {}) =>
  spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: quiet ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });

const runPnpm = (args, cwd, options) =>
  run(process.platform === 'win32' ? 'corepack.cmd' : 'corepack', ['pnpm', ...args], cwd, options);

const pack = async (name, destination) => {
  const packageDirectory = path.join(repoRoot, 'packages', name.replace('@depo-ui/', ''));
  const outputDirectory = path.join(destination, name.replace('@depo-ui/', ''));
  await mkdir(outputDirectory);
  const result = runPnpm(['pack', '--pack-destination', outputDirectory], packageDirectory, {
    quiet: true,
  });
  if (result.status !== 0) throw new Error(`${name}: pnpm pack failed: ${result.stderr}`);
  const tarball = (await readdir(outputDirectory)).find((entry) => entry.endsWith('.tgz'));
  if (!tarball) throw new Error(`${name}: pnpm pack produced no tarball`);
  return path.join(outputDirectory, tarball);
};

const main = async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'depo-ui-clean-consumer-'));
  const packDirectory = path.join(temporaryRoot, 'pack');
  const consumerDirectory = path.join(temporaryRoot, 'consumer');
  await mkdir(packDirectory);
  await mkdir(consumerDirectory);
  try {
    const tarballs = Object.fromEntries(
      await Promise.all(
        publicPackages.map(async (name) => [name, await pack(name, packDirectory)]),
      ),
    );
    const dependencies = {
      react: '19.2.8',
      'react-dom': '19.2.8',
      ...Object.fromEntries(publicPackages.map((name) => [name, `file:${tarballs[name]}`])),
    };
    const overrides = Object.fromEntries(
      publicPackages.map((name) => [name, `file:${tarballs[name]}`]),
    );
    await writeFile(
      path.join(consumerDirectory, 'package.json'),
      JSON.stringify(
        {
          name: 'depo-ui-clean-consumer',
          private: true,
          packageManager: 'pnpm@11.25.0',
          type: 'module',
          scripts: { typecheck: 'tsc --noEmit', build: 'vite build' },
          dependencies,
          devDependencies: {
            '@types/react': '19.2.18',
            '@types/react-dom': '19.2.4',
            typescript: '5.9.3',
            vite: '8.2.1',
          },
        },
        null,
        2,
      ),
    );
    await writeFile(
      path.join(consumerDirectory, 'pnpm-workspace.yaml'),
      `overrides:\n${Object.entries(overrides)
        .map(([name, value]) => `  "${name}": "${value}"`)
        .join('\n')}\n`,
    );
    await writeFile(
      path.join(consumerDirectory, 'index.html'),
      '<div id="root"></div><script type="module" src="/src/main.tsx"></script>\n',
    );
    await mkdir(path.join(consumerDirectory, 'src'));
    await writeFile(
      path.join(consumerDirectory, 'src/main.tsx'),
      `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@depo-ui/react/css';
import { Button, Card, Field, TextInput } from '@depo-ui/react';

function App() {
  return (
    <Card>
      <Field label="Project name" required>
        <TextInput name="projectName" />
      </Field>
      <Button type="submit">Create project</Button>
    </Card>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
    );
    await writeFile(
      path.join(consumerDirectory, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            lib: ['ES2022', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            moduleResolution: 'Bundler',
            jsx: 'react-jsx',
            strict: true,
            skipLibCheck: true,
            noEmit: true,
          },
          include: ['src'],
        },
        null,
        2,
      ),
    );
    for (const [command, args] of [
      ['pnpm', ['install', '--prefer-offline', '--ignore-scripts']],
      ['pnpm', ['run', 'typecheck']],
      [
        process.execPath,
        [
          '--input-type=module',
          '-e',
          "const module = await import('@depo-ui/react'); if (!module.Button || !module.Card) process.exit(1);",
        ],
      ],
      ['pnpm', ['run', 'build']],
    ]) {
      const result =
        command === 'pnpm'
          ? runPnpm(args, consumerDirectory)
          : run(command, args, consumerDirectory);
      if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed`);
    }
    console.log(
      'Clean consumer passed: packed React 19 artifacts resolved outside the workspace, including CSS, declarations, runtime exports, and a Vite build.',
    );
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
};

try {
  await main();
} catch (error) {
  console.error(`Clean consumer check failed: ${error.message}`);
  process.exitCode = 1;
}
