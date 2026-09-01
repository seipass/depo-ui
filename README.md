# Depo UI Design System

Depo UI is a reusable Web and React design system for SaaS, dashboards, administration tools, data-heavy interfaces, internal tools, and documentation UIs.

## Status

Phase 0 — Repository Foundation is implemented. The repository has its workspace, package boundaries, tool configuration, CI entrypoint, documentation entrypoint, and dependency checks. Feature implementation begins with Phase 1 — Tokens and has not started yet.

Read PLAN.md before making architectural changes. Read AGENTS.md for the short repository map and working commands.

## Quick start

The repository pins Node and pnpm. Use Corepack:

~~~text
corepack enable
corepack pnpm install --frozen-lockfile
corepack pnpm lint:deps
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm build
~~~

## Package boundaries

All Component implementation will be placed under packages/components/src/<category>/<Component>/. Package manifests and public exports remain at package roots. Internal dependency rules are checked by corepack pnpm lint:deps.

Feature packages are intentionally empty in Phase 0. Do not add tokens, CSS, React Components, Patterns, or app screens until the corresponding phase in PLAN.md.

The next implementation entry point is Phase 1 — Tokens: packages/tokens/src/reference/, packages/tokens/src/semantic/, and packages/tokens/src/themes/. Token build and lint work belongs under tooling/token-build/ and tooling/token-lint/.
