import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const changesetDirectory = path.join(repoRoot, '.changeset');
const entries = await readdir(changesetDirectory, { withFileTypes: true });
const pending = entries.filter(
  (entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md',
);

if (pending.length === 0) {
  console.log('Changeset status: no pending release intents.');
} else {
  const result =
    process.platform === 'win32'
      ? spawnSync(
          process.env.ComSpec ?? 'cmd.exe',
          ['/d', '/s', '/c', 'pnpm.cmd exec changeset status'],
          {
            cwd: repoRoot,
            stdio: 'inherit',
          },
        )
      : spawnSync('pnpm', ['exec', 'changeset', 'status'], { cwd: repoRoot, stdio: 'inherit' });
  if (result.status !== 0) process.exitCode = result.status ?? 1;
}
