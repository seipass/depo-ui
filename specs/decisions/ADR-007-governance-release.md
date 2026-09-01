# ADR-007: Governance, release, and migration boundary

- Status: Accepted for Phase 10.
- Date: 2026-09-02
- Owners: Depo UI Design System maintainers
- Review date: Before the first package is made publishable.

## Context

Depo UI needs lifecycle decisions, release intent, migration evidence, and registry access to remain reviewable and reproducible. Component metadata describes the public contract, while production usage, issue severity, adoption, accessibility audits, and approvals are operational evidence. The repository must also be safe to install with the pinned pnpm 11 toolchain on a clean machine.

## Decision

1. `specs/components/**/*.json` remains the source of the public Component contract and lifecycle name. `governance/evidence/components.json` records the operational evidence used to decide whether a lifecycle transition is eligible; neither boundary silently replaces the other.
2. Package-source, public API, breaking, and deprecation changes require a real Changeset. The Changesets version PR is separate from publishing, and internal workspace dependencies are versioned through the Changesets graph.
3. Publishing is only available through the protected `release` environment after explicit approval and a CI-provided npm token. Private packages are rejected as publish candidates, and rollback uses a forward fix or patch/revert release; unpublish is forbidden.
4. Deprecated and removed APIs must have a registry entry with release boundaries, warning text, a narrow AST-aware codemod or manual recipe, a support window, and linked recovery guidance. The codemod changes only the registered JSX property on the registered Component.
5. The pinned pnpm 11 installation explicitly denies the reviewed-but-unneeded `core-js` build script with `allowBuilds: core-js: false`. New dependency build scripts must be reviewed and explicitly allowed or denied rather than enabling all scripts.
6. The Turborepo `typecheck` task builds transitive workspace dependencies before checking types because package exports intentionally point at generated `dist` artifacts. This keeps a clean checkout independently typecheckable without committing machine-generated build output.

## Alternatives considered

- Store evidence only in Component metadata: rejected because public API ownership and mutable production/review evidence have different lifecycles.
- Publish directly from CI or allow private workspace packages to publish: rejected because an accidental registry mutation would bypass owner approval and package-visibility review.
- Rewrite every use of a deprecated API or infer Product migrations: rejected because a codemod cannot safely infer domain data, strings, or business behavior.
- Enable all dependency build scripts or keep an uncommitted local pnpm approval: rejected because it weakens supply-chain review and makes clean CI behavior dependent on one machine.
- Require a prior full workspace build before every typecheck: rejected because the typecheck command should be reproducible from a clean checkout and should declare its dependency-artifact requirement in the task graph.

## Consequences

- Lifecycle changes are fail-closed until their owner, review, accessibility, usage, migration, and release evidence is present.
- Versioning and publishing can be rehearsed without mutating a registry, while the real publish operation remains an explicitly approved external action.
- A new dependency with an install script creates a deliberate policy decision in `pnpm-workspace.yaml`; the default installation does not silently execute it.
- Typecheck may run the dependency build tasks first, so it is not a source-only check for workspace packages whose public exports require build artifacts.
