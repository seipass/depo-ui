# Repository Foundation

Phase 0 established the workspace and its boundaries. Subsequent phases now populate the planned source, generated artifact, testing, documentation, Figma, and governance boundaries described by PLAN.md.

## Source of truth

- PLAN.md is the implementation roadmap.
- specs/ is the formal design source once a feature phase begins.
- package.json and pnpm-workspace.yaml define workspace and package boundaries.
- tooling/dependency-check/rules.json defines the machine-readable internal dependency policy.

## Current status

The repository contains the implemented Token, Foundation, Primitive, Component, Pattern, React facade, Docs, Figma mapping, accessibility, testing, and governance boundaries. Package manifests and public exports remain at package roots; Component source remains below `packages/components/src/`. Generated artifacts are rebuilt by their owning tooling and are not edited directly.

Phase 10 — Governance / Release is complete. Release maintenance must use the lifecycle policy, Changesets, evidence registry, migration registry, and protected publish workflow; do not bypass those gates by editing generated versions or changelogs manually.
