# Figma synchronization boundary

Depo UI treats repository token JSON and Component metadata as the Source of Truth. Figma is a named projection used for design work and parity review. The mapping keys, names, modes, variants, properties, and lifecycle values are versioned in this repository; Figma-only values are not an alternate design-system source.

## Workflow

1. Run `pnpm figma:generate` after changing token or Component metadata source.
2. Run `pnpm figma:check` to validate token mode completeness, Component property parity, stable mapping keys, and the generated report.
3. Run `pnpm figma:preview` to create a repository-to-Figma dry-run plan. Missing items are proposed for creation, changes are proposed for update, renames are surfaced, and extra Figma objects are never deleted automatically.
4. Run the read-only pull form with `pnpm figma:pull -- --snapshot path/to/export.json` when a Figma export is available. Pull reports differences but never edits `packages/tokens/`, `specs/`, or `figma/` source files.
5. A maintainer may invoke the explicit publish path only after reviewing the plan, setting credentials through the environment, and obtaining owner approval. The default path remains dry-run.

The REST transport is optional. When Enterprise REST access is unavailable, the same mapping can be applied through a Figma Plugin API adapter. Neither transport stores credentials in this repository. `FIGMA_ACCESS_TOKEN`, `FIGMA_FILE_KEY`, and optional `FIGMA_API_URL` are read only from the process environment and are never printed.

`figma/variables/collections.json` and `figma/components/naming.json` are human-maintained policy. `figma/mapping/*.json` and `figma/sync/parity-report.json` are generated outputs; do not edit them directly.
