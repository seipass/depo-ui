# Changesets

This directory contains one short Markdown file per release intent. The frontmatter names the affected `@depo-ui/*` package and uses `major`, `minor`, or `patch`; the body is the user-facing change summary.

Use `pnpm changeset` to create a file. Reviewers must confirm the lifecycle, API, accessibility, content, migration, and support-window impact before merge. Do not add a placeholder changeset merely to satisfy CI: a package change needs a real release note, while governance-only and documentation-only changes may omit one.

`config.json` is the Changesets configuration source. The repository keeps private workspace packages versionable for internal dependency graph validation, but `tooling/release/publish.mjs` refuses publication until the package is explicitly publishable and an approved release environment is present.

Never edit generated changelogs or package versions manually during a version PR. Run `pnpm release:version` through the Changesets workflow, inspect the diff, then use the release approval route described in `governance/release/README.md`.
