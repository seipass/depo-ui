# ADR-006: Figma source boundary and synchronization

## Status

Accepted for Phase 8.

## Context

Depo UI needs Figma Variables and component sets to use the same names as code while keeping token semantics, themes, lifecycle, and accessibility contracts reviewable in Git. Figma may be available through an Enterprise REST integration, a Plugin API, or not at all in local and CI environments.

## Decision

- `packages/tokens/src/` remains the source of truth for Reference, Semantic, and the single Dark appearance mapping. `specs/components/**/*.json` remains the source of truth for Component metadata and lifecycle.
- `figma/variables/collections.json` defines one Semantic collection with a single Dark appearance mode. `figma/mapping/tokens.json` is generated from Semantic token JSON and contains names, types, source paths, and mode identities, not copied values. OS forced-colors is handled by CSS and is not a Figma theme mode.
- `figma/components/naming.json` defines the shared Component set and property vocabulary. `figma/mapping/components.json` is generated from Component metadata and retains the `packages/components/src/` source path.
- Every mapping has a stable `depoUiKey` based on its repository identity. A changed display name is reported as a rename, not silently treated as a new object. Extra Figma objects are review findings and are not deleted automatically.
- Repository-to-Figma push is dry-run by default. Figma-to-repository pull is read-only and produces a diff; it never overwrites token JSON, metadata, or mapping policy.
- REST is used only when credentials and an explicit API URL are present. Plugin API is the fallback adapter when REST is unavailable. Publishing is a separate, explicit, owner-approved operation.
- Credentials are process environment inputs only. No token, file key, Figma-only secret, or private value is stored in source, generated mapping, test fixture, or log output.

## Alternatives considered

- Figma as the source of truth: rejected because token tier dependencies, DTCG validation, code generation, and review history would become opaque to the repository.
- Bidirectional automatic merge: rejected because it can overwrite semantic roles or silently change accessibility and theme contracts.
- One universal Overlay/Sync manager: rejected in favor of separate mapping, diff, transport, and publish responsibilities.

## Consequences

Token and Component changes require regeneration and parity checks. A Figma export is useful for detecting drift, but a human must review rename, removal, and publish decisions. CI can validate mapping completeness without Figma credentials; credentialed publishing remains an explicit external operation.
