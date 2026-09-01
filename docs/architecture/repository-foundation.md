# Repository Foundation

Phase 0 establishes the workspace and its boundaries. Feature source is intentionally absent until the phase assigned by PLAN.md.

## Source of truth

- PLAN.md is the implementation roadmap.
- specs/ is the formal design source once a feature phase begins.
- package.json and pnpm-workspace.yaml define workspace and package boundaries.
- tooling/dependency-check/rules.json defines the machine-readable internal dependency policy.

## Current status

The repository contains package manifests, public export placeholders, tool configuration, CI entrypoints, documentation entrypoint, and empty planned directories. It does not contain tokens, foundations implementation, primitives, components, patterns, or an application.

The next feature phase is Phase 1 — Tokens. Do not add token values or component code during Phase 0 maintenance.
