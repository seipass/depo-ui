# Depo UI Design System

Depo UI is a reusable Web and React design system for SaaS, dashboards, administration tools, data-heavy interfaces, internal tools, and documentation UIs.

## Status

Phases 0–9 are implemented: Repository Foundation, Tokens, Foundations, Primitives, Basic Controls, Overlay Infrastructure, Composite Components, Advanced Components, Patterns, Accessibility Infrastructure, Figma Integration, and Documentation. Phase 10 — Governance / Release has not started yet.

Read PLAN.md before making architectural changes. Read AGENTS.md for the short repository map and working commands.

## Quick start

The repository pins Node and pnpm. Use Corepack:

```text
corepack enable
corepack pnpm install --frozen-lockfile
corepack pnpm lint:deps
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm build
corepack pnpm docs:generate
corepack pnpm docs:check
corepack pnpm --filter @depo-ui/docs start
```

## Package boundaries

Component implementation lives under `packages/components/src/<category>/<Component>/`. Package manifests and public exports remain at package roots; internal dependency rules are checked by `corepack pnpm lint:deps`. Documentation source is split between formal specifications in `specs/`, human-oriented pages in `apps/docs/content/`, and generated reference artifacts owned by `tooling/docs-generator/`.

The next implementation entry point is Phase 10 — Governance / Release. Before changing architecture, read PLAN.md and the relevant specification. Read AGENTS.md for the short repository map and working commands.
