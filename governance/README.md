# Governance

Governance is the operational source for lifecycle, ownership, release, migration, and contribution decisions. `governance/lifecycle/policy.json` is the machine-readable status and gate policy; `governance/ownership/owners.json` maps metadata owners to primary/backup review groups; `governance/evidence/components.json` records production, issue, adoption, accessibility, and review evidence; and `governance/release/policy.json` defines version, publish, support-window, and rollback rules.

Run `pnpm governance:check` before changing lifecycle metadata or release tooling. It validates every Component metadata file, the evidence boundary, owner aliases, migration registry, Changesets configuration, internal dependency graph, and a packed token-package install. The check is fail-closed for `Stable`, `Deprecated`, and `Removed` entries that do not have the required evidence.

Phase 0 records repository-foundation decisions in `specs/decisions/ADR-000-repository-foundation.md`; the Phase 10 boundary is recorded in `specs/decisions/ADR-007-governance-release.md`. Later governance decisions add an ADR rather than silently rewriting that history. CI and the PR template enforce the review route; `.github/workflows/release.yml` versions packages, while the protected manual publish workflow is the only path that can call the registry.
