# ADR-004: Component API and ref contract

- Status: Accepted for the initial Web/React implementation.
- Date: 2026-09-01
- Owners: Depo UI Design System maintainers
- Review date: Before adding React 18 support or a new public escape hatch.

## Context

Depo UI needs Component APIs that stay composable across forms, navigation, overlays, and data-heavy interfaces without exposing arbitrary DOM or Product state. The API must also make keyboard, accessibility, localization, and React ref behavior part of the same contract.

## Decision

1. Every Component contract defines purpose, anatomy, variants, states, props, events, semantics, keyboard behavior, focus behavior, content, responsive behavior, density, theme, loading, error, recovery, tests, lifecycle, owner, and Figma identity in the canonical metadata boundary.
2. Public prop names use the shared vocabulary (`variant`, `size`, `tone`, `density`, `disabled`, `loading`, and the Component-specific state model). Controlled state is explicit; Components do not accept arbitrary state strings or Product-specific data adapters.
3. Composition uses documented slots and public exports. Consumers do not deep-import internal files or use unrestricted `as`, CSS, DOM, z-index, or token escape hatches. A primitive may expose `as` only for the semantic elements allowed by its contract.
4. With the initial React 19 peer range, a Component that documents a meaningful DOM or imperative target receives `ref` as a normal prop. Components without that target do not publish a ref API. `forwardRef` is not added mechanically, and React 18 compatibility requires a new compatibility decision before changing the peer range.
5. Native HTML semantics are preferred. ARIA, focus management, and keyboard behavior are added only for the interaction model that the Component contract requires; shared lower-layer helpers are reused instead of recreated in each Component.

## Alternatives considered

- Expose every DOM attribute and arbitrary CSS escape hatch: rejected because it makes semantics, tokens, responsive behavior, and accessibility unreviewable.
- Use one unrestricted `state` prop: rejected because it collapses independent interaction, validation, loading, and recovery dimensions into an ambiguous string.
- Wrap every Function Component in `forwardRef`: rejected because ref is a meaningful capability, not a universal API, and React 19 supports ref as a prop for the selected range.
- Put task-specific data fetching or authorization into Components: rejected because Product logic belongs in Patterns, examples, or consumer adapters.

## Consequences

- A new Component requires matching metadata, source directory, public export, Story, unit/a11y/visual tests, Figma mapping, and lifecycle evidence.
- API changes are reviewable as contract and migration changes rather than accidental DOM or CSS differences.
- Components can share foundation and accessibility infrastructure while keeping package dependency direction acyclic.
