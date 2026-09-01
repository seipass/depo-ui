const allowedTasks = new Set([
  'dev',
  'build',
  'typecheck',
  'lint',
  'test',
  'tokens',
  'raw-values',
  'tokens:build',
  'tokens:check',
  'generate',
  'docs:generate',
  'figma:check',
  'changeset',
  'release:check',
]);

const task = process.argv[2] ?? 'unknown';

if (!allowedTasks.has(task)) {
  console.error('[Phase 0] Unknown placeholder task: ' + task);
  process.exitCode = 1;
} else {
  console.log(
    '[Phase 0] ' +
      task +
      ': repository foundation is ready; feature implementation remains deferred to its planned phase.',
  );
}
