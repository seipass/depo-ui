import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  createExpectedSnapshot,
  createSyncPlan,
  loadFigmaSource,
  loadValidatedTokenModel,
} from './model.mjs';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const argument = process.argv[index];
  if (!argument.startsWith('--')) continue;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) args.set(argument.slice(2), true);
  else {
    args.set(argument.slice(2), value);
    index += 1;
  }
}

const direction = String(args.get('direction') ?? 'push');
const dryRun = !args.has('apply');
const publish = args.has('publish');
if (publish && dryRun)
  throw new Error('Figma publish requires --apply after reviewing a dry-run plan.');

const snapshotPath = args.get('snapshot') ?? process.env.FIGMA_SNAPSHOT;
const actual = snapshotPath
  ? JSON.parse(await readFile(path.resolve(String(snapshotPath)), 'utf8'))
  : { variables: [], components: [] };
const model = await loadValidatedTokenModel();
const { componentMapping, tokenMapping } = await loadFigmaSource();
const expected = createExpectedSnapshot({ componentMapping, model, tokenMapping });
const plan = createSyncPlan({ actual, direction, dryRun, environment: process.env, expected });

const output = {
  ...plan,
  publish: {
    requested: publish,
    requiresOwnerApproval: true,
    executed: false,
  },
};
console.log(JSON.stringify(output, null, 2));
