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

`pnpm release:check` validates Changesets and the version graph, verifies lifecycle/evidence/migration policy, packs `@depo-ui/tokens`, and installs that tarball in an isolated consumer fixture. It does not publish. Use `pnpm release:version` only in the Changesets version PR workflow.

## Approval and rollback

The version PR must have design/API/accessibility/component/release approval and a reviewed Changeset. Publishing requires the protected `release` environment, `RELEASE_PUBLISH_APPROVED=true`, and a secret `NODE_AUTH_TOKEN` or `NPM_TOKEN`; `pnpm release:publish` refuses private packages and never unpublishes a package. Recover a bad release with a forward-fix or an explicit patch/revert release, preserving the incident and migration links.
