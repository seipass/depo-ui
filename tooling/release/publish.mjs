import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPublishAuthentication } from './auth.mjs';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const policyPath = path.join(repoRoot, 'governance/release/policy.json');
const policy = JSON.parse(await readFile(policyPath, 'utf8'));

const fail = (message) => {
  console.error('Release publish blocked: ' + message);
  process.exitCode = 1;
};

if (process.env.RELEASE_PUBLISH_APPROVED !== 'true') {
  fail(
    `set RELEASE_PUBLISH_APPROVED=true only inside the protected ${policy.publish.approvalEnvironment} environment`,
  );
} else if (process.env.RELEASE_PUBLISH_DRY_RUN === 'true') {
  console.log('Release publish dry run approved; no registry mutation was performed.');
} else {
  const authentication = getPublishAuthentication(process.env, policy);
  if (!authentication.runtime) {
    fail('publishing is allowed only from the protected GitHub Actions release workflow');
  } else if (!authentication.oidc && !authentication.bootstrapToken) {
    fail(
      'publishing requires GitHub Actions OIDC Trusted Publishing or a bootstrap npm token from the protected release environment',
    );
  } else {
    const result =
      process.platform === 'win32'
        ? spawnSync(
            process.env.ComSpec ?? 'cmd.exe',
            ['/d', '/s', '/c', 'pnpm.cmd exec changeset publish'],
            {
              cwd: repoRoot,
              stdio: 'inherit',
            },
          )
        : spawnSync('pnpm', ['exec', 'changeset', 'publish'], { cwd: repoRoot, stdio: 'inherit' });
    if (result.status !== 0) process.exitCode = result.status ?? 1;
  }
}
