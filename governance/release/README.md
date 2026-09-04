# Release operations

The release boundary is deliberately split into review, version, and publish steps:

1. Add a real Changeset for package/API/lifecycle work with `pnpm changeset`.
2. Run `pnpm release:check` and the full quality matrix. The check validates lifecycle policy, owners, evidence, migration entries, package graph, and a packed token package install.
3. Merge the reviewed Changeset. `.github/workflows/release.yml` runs `pnpm release:version` and opens the version PR; it does not publish.
4. Review generated package versions and changelogs, internal dependency bumps, Docs, Figma parity, and migration notes in the version PR.
5. Start `.github/workflows/publish.yml` manually from the `release` environment only after approval. `tooling/release/publish.mjs` fails closed unless the protected GitHub Actions runtime and npm Trusted Publishing OIDC or a bootstrap token are present, and it refuses private packages.

`master` is the Changesets base branch and versions use SemVer. Internal `workspace:` dependencies are bumped by Changesets according to `.changeset/config.json`; the release check also verifies the graph is acyclic. A failed release is recovered with a forward fix or an explicit revert/patch release. Packages are never unpublished as a rollback mechanism.

The initial public release versions only the nine public packages. Keep `privatePackages.version` set to `false` so Docs, Playground, visual tests, examples, and the root workspace do not receive release versions or changelogs.

The support window for a Deprecated API is at least two release windows. Its release note must link the replacement, deprecation warning, codemod or manual recipe, removal target, and issue/owner. A Removed API requires a major release except for the documented security/emergency exception.
