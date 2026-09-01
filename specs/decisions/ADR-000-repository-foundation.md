# ADR-000: Repository Foundation

- Status: Accepted
- Date: 2026-09-01
- Owners: Depo UI Design System maintainers

## Context

Depo UI starts from a blank repository and needs a reproducible workspace before feature implementation. The repository must expose clear package boundaries to humans, CI, and Codex without introducing Phase 1 token or UI behavior.

## Decisions

1. The repository uses pnpm workspaces, the workspace: protocol, pnpm catalogs, and Turborepo task orchestration.
2. The package scope is @depo-ui/*. Workspace packages remain private until the release governance phase defines publication permissions and registry details.
3. The baseline runtime is Node 24.19.0, managed by .nvmrc and the root engine range >=24.19.0 <25.
4. The baseline package manager is pnpm 11.25.0, activated through Corepack and recorded in the root packageManager field.
5. The initial React peer range is >=19.0.0 <20.0.0. React 18 is not supported by the initial package range.
6. With the React 19 range, Function Components receive ref as a normal prop where the Component Contract exposes a meaningful DOM node or limited imperative handle. New Components do not use forwardRef as a standard implementation. No React 18 compatibility layer is created in Phase 0.
7. TypeScript 5.9.3 is used for the foundation configuration. The registry's current TypeScript 7.0.2 was not selected because the selected typescript-eslint 8.69.0 peer range requires TypeScript below 6.1.0. This is a compatibility constraint to revisit when the lint toolchain supports TypeScript 7.
8. The repository is MIT licensed. Package publication remains a later governance decision even though source licensing is established now.
9. Browser support starts with current and previous stable Chrome, Edge, Firefox, and Safari releases, plus the corresponding iOS Safari baseline. Internet Explorer is out of scope. The accessibility baseline remains WCAG 2.2 AA, 320 CSS px reflow, 400% zoom, and the manual NVDA/Chromium and VoiceOver/Safari matrix in PLAN.md.
10. Component source is under packages/components/src/<category>/<Component>/. Package manifests and exports stay at packages/components/package.json; category directories are never created at the package root.
11. The selected Stylelint 17 CLI uses `--allow-empty-input`; the Phase 0 lint script uses that current option so an empty CSS source tree is a valid foundation state.
12. The selected Vitest 4.1.11 configuration uses `defineProject` in `vitest.workspace.ts`. The installed version no longer exports `defineWorkspace`, and its default config discovery does not load the legacy workspace filename automatically; the root test commands therefore pass `--config vitest.workspace.ts` explicitly while keeping the planned workspace entry point. The root test command supplies `--passWithNoTests` until test files exist.
13. Playwright 1.62.1 does not expose `use.reducedMotion` in its current `UseOptions` type. Phase 0 therefore keeps the base browser configuration type-safe; future reduced-motion tests will set the media preference with the supported per-test/page emulation API.
14. Turbo's Phase 0 placeholder build tasks declare no outputs because no package emits `dist/` before Phase 1. The real library/docs build will add its concrete output paths when implementation begins.

## Alternatives considered

- npm or Yarn workspaces: rejected for Phase 0 because pnpm's strict workspace and catalog model matches the planned dependency policy.
- Node 22: rejected as the baseline because the implementation environment is already on the Node 24 Active LTS line and selected tooling requires a modern Node runtime.
- React 18 plus unconditional forwardRef: rejected for the initial range because React 19 ref-as-prop is the intended new-component model and the compatibility cost is not justified without a support requirement.
- TypeScript 7 with an older lint integration: rejected because it would weaken the selected typescript-eslint compatibility contract.
- A legacy Stylelint empty-input flag and Vitest `defineWorkspace`: rejected because the selected current package versions expose different supported APIs.

## Consequences

- Phase 0 CI can verify installation, package graph, exports, type configuration, lint configuration, tests, and build orchestration with no feature source.
- React support and ref behavior are explicit and can be reopened by a new ADR if a consumer requires React 18.
- The TypeScript version is intentionally not the registry's newest major until the lint integration supports it.
