import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const registry = JSON.parse(
  await readFile(path.join(repoRoot, 'governance/migrations/registry.json'), 'utf8'),
);

const valueFor = (flag) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? undefined : process.argv[index + 1];
};

const migrationId = valueFor('--migration');
const inputPath = valueFor('--input');
const outputPath = valueFor('--output');
const dryRun = process.argv.includes('--dry-run');

if (!migrationId || !inputPath || (!outputPath && !dryRun)) {
  console.error(
    'Usage: node tooling/codemods/run.mjs --migration <id> --input <file> --output <file> [--dry-run]',
  );
  process.exitCode = 1;
} else {
  const migration = registry.migrations.find((entry) => entry.id === migrationId);
  if (!migration) {
    console.error(`Unknown migration: ${migrationId}`);
    process.exitCode = 1;
  } else {
    const source = await readFile(path.resolve(inputPath), 'utf8');
    const scriptKind =
      path.extname(inputPath).toLowerCase() === '.tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const sourceFile = ts.createSourceFile(
      inputPath,
      source,
      ts.ScriptTarget.Latest,
      true,
      scriptKind,
    );
    const edits = [];

    const tagName = (tag) => {
      if (ts.isIdentifier(tag)) return tag.text;
      if (ts.isPropertyAccessExpression(tag)) return `${tagName(tag.expression)}.${tag.name.text}`;
      return undefined;
    };

    const visit = (node, currentComponent) => {
      let component = currentComponent;
      if (ts.isJsxElement(node)) component = tagName(node.openingElement.tagName);
      if (ts.isJsxSelfClosingElement(node)) component = tagName(node.tagName);
      if (
        ts.isJsxAttribute(node) &&
        component === migration.component &&
        node.name.text === migration.fromProp
      ) {
        edits.push({ start: node.name.getStart(sourceFile), end: node.name.end });
      }
      ts.forEachChild(node, (child) => visit(child, component));
    };
    visit(sourceFile, undefined);

    let transformed = source;
    for (const edit of edits.sort((left, right) => right.start - left.start)) {
      transformed = `${transformed.slice(0, edit.start)}${migration.toProp}${transformed.slice(edit.end)}`;
    }
    if (dryRun) process.stdout.write(transformed);
    else await writeFile(path.resolve(outputPath), transformed, 'utf8');
    console.error(
      `${migrationId}: ${edits.length} JSX prop${edits.length === 1 ? '' : 's'} migrated from ${migration.fromProp} to ${migration.toProp}.`,
    );
  }
}
