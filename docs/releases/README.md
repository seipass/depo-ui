# Release operations

This is the repository-facing release runbook. The public, versioned explanation is rendered by `apps/docs/content/releases/index.mdx`; this file records the commands and safety boundary maintainers need while preparing a release.

## Dry run

```text
pnpm governance:check
pnpm release:status
pnpm release:check
pnpm docs:check
pnpm figma:check
pnpm test
pnpm build
```

`pnpm release:check` validates Changesets and the version graph, verifies lifecycle/evidence/migration policy, validates the public package metadata and package boundary, packs every public package, and checks the packed contents and internal dependency ranges. It does not publish. Use `pnpm release:version` only in the Changesets version PR workflow.

## Approval and rollback

The version PR must have design/API/accessibility/component/release approval and a reviewed Changeset. Make the GitHub repository public and create or own the `depo-ui` npm scope before the first public release. Publishing requires the protected `release` environment, exact manual confirmation, and the expected GitHub Actions workflow. Prefer npm Trusted Publishing (OIDC); use a narrowly scoped granular access token in the `release` environment only for the initial bootstrap when a package does not yet exist. After a successful OIDC verification, remove the bootstrap secret, require 2FA, and disallow traditional publish tokens where npm permits it. `pnpm release:publish` refuses private packages and never unpublishes a package. Recover a bad release with a forward-fix or an explicit patch/revert release, preserving the incident and migration links.
