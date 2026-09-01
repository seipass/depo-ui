# Depo UI repository guide

## Repository purpose

Depo UI is a reusable Web and React design system for SaaS, dashboards, administration tools, data-heavy UIs, and documentation UIs. PLAN.md is the active roadmap and the source to consult before changing architecture.

## Architecture map

- packages/tokens/: token source and generated artifacts.
- Phase 1 starts at packages/tokens/src/reference/, packages/tokens/src/semantic/, packages/tokens/src/themes/, with build/lint work under tooling/token-build/ and tooling/token-lint/.
- packages/foundations/: theme, typography, layout, density, motion, and layer foundations.
- packages/primitives/: small layout and DOM primitives.
- packages/components/src/<category>/: all reusable Component source.
- packages/patterns/: task-oriented composition.
- packages/accessibility/, packages/utilities/, packages/icons/: shared lower-level capabilities.
- packages/react/: React public facade and providers.
- specs/: formal contracts and ADRs.
- testing/, tooling/, governance/: shared verification, generation, and operating policy.
- apps/: Docs, Playground, and Visual Test consumers.

## Dependency rules

The allowed direction is tokens → foundations → primitives → components → patterns → React facade → apps/examples. Accessibility, utilities, and icons are lower-level dependencies described in tooling/dependency-check/rules.json. No cycles, deep imports, generated-to-source imports, or Product logic in Core packages.

Component source always lives below packages/components/src/; packages/components/package.json remains at the package root. Product code uses public exports and Semantic Tokens, never Reference Tokens directly.

## Commands

Use the pinned toolchain through Corepack:

- corepack enable
- corepack pnpm install --frozen-lockfile
- corepack pnpm lint:deps
- corepack pnpm typecheck
- corepack pnpm lint
- corepack pnpm test
- corepack pnpm build
- corepack pnpm governance:check
- corepack pnpm release:check
- corepack pnpm docs:check
- corepack pnpm figma:check

Token, generator, Docs, Figma, Changeset, governance, and release commands are implemented at their planned boundaries. `pnpm release:version` is for the Changesets version PR; `pnpm release:publish` is protected and must not be run without the release environment and approval variables.

## Testing rules

Run the smallest relevant check, then the Phase exit checks. Accessibility, keyboard, focus, theme, responsive, localization, and reduced-motion requirements are part of the Component Contract; do not defer them.

## Generated files and documentation

Do not edit generated artifacts directly. Formal decisions belong in specs/; operational notes belong in docs/ and governance/; user-facing material belongs in apps/docs/. Changeset intent lives in .changeset/, while lifecycle evidence lives in governance/evidence/. Keep AGENTS.md as a short map and place detailed rules in the linked source.

## Important constraints

Do not add Product-specific behavior to Core packages, introduce raw token values, create broad escape hatches, bypass package exports, publish without the protected release gate, or start a later phase without updating the active phase's exit criteria.
