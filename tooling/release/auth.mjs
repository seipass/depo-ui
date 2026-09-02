const expectedRepository = 'seipass/depo-ui';
const expectedWorkflow = /^seipass\/depo-ui\/\.github\/workflows\/publish\.yml@/;

const present = (value) => typeof value === 'string' && value.trim().length > 0;

export const isGitHubActionsPublishRuntime = (environment = process.env, policy) =>
  environment.GITHUB_ACTIONS === 'true' &&
  environment.GITHUB_SERVER_URL === 'https://github.com' &&
  environment.GITHUB_REPOSITORY === expectedRepository &&
  expectedWorkflow.test(environment.GITHUB_WORKFLOW_REF ?? '') &&
  present(environment.GITHUB_RUN_ID) &&
  environment.RUNNER_ENVIRONMENT === 'github-hosted' &&
  environment.RELEASE_ENVIRONMENT === policy.publish.approvalEnvironment;

export const hasGitHubActionsOidc = (environment = process.env, policy) =>
  isGitHubActionsPublishRuntime(environment, policy) &&
  present(environment.ACTIONS_ID_TOKEN_REQUEST_URL) &&
  present(environment.ACTIONS_ID_TOKEN_REQUEST_TOKEN);

export const hasBootstrapToken = (environment = process.env, policy) =>
  isGitHubActionsPublishRuntime(environment, policy) &&
  (present(environment.NODE_AUTH_TOKEN) || present(environment.NPM_TOKEN));

export const getPublishAuthentication = (environment = process.env, policy) => {
  const runtime = isGitHubActionsPublishRuntime(environment, policy);
  const oidc = hasGitHubActionsOidc(environment, policy);
  const bootstrapToken = hasBootstrapToken(environment, policy);
  return {
    runtime,
    oidc,
    bootstrapToken,
    allowed: runtime && (oidc || bootstrapToken),
  };
};
