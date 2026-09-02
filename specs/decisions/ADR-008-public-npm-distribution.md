# ADR-008: Public npm distribution and Trusted Publishing

- Status: Accepted for public-release preparation.
- Date: 2026-09-02
- Owners: Depo UI Design System maintainers
- Review date: Before the first public npm publish.

## Context

Depo UI is a workspace design system, but application consumers need one stable React installation and a reproducible CSS entrypoint. The repository also needs a release path that does not turn a long-lived npm write token into a permanent GitHub credential. The package boundary, Changesets version PR, lifecycle evidence, protected environment, and dependency direction remain existing architectural constraints.

## Decision

1. The public npm boundary is the runtime dependency closure of `@depo-ui/react`: `@depo-ui/accessibility`, `@depo-ui/components`, `@depo-ui/foundations`, `@depo-ui/icons`, `@depo-ui/patterns`, `@depo-ui/primitives`, `@depo-ui/react`, `@depo-ui/tokens`, and `@depo-ui/utilities`. Root workspace, Docs, Playground, visual tests, and examples remain private.
2. Public package manifests use the existing `@depo-ui/*` names, MIT license, canonical GitHub repository metadata, public npm access, package file allowlists, explicit exports, and provenance. Build output excludes tests, stories, visual fixtures, and source directories from the packed artifact.
3. `@depo-ui/react` is the product-facing entrypoint. `@depo-ui/react/css` imports only `@depo-ui/components/css`; the existing CSS chain transitively supplies primitives, foundations, and tokens without requiring consumer-side transitive CSS imports.
4. The initial release intent is one Changeset covering all nine public packages with a minor bump. Changesets remains the only source of release versions and internal dependency updates; package source versions remain unchanged until the reviewed version PR.
5. Publishing remains a separate manual workflow. The `release` GitHub Environment, exact `publish` confirmation, fail-closed gate, and private-package rejection remain required. A real publish must run in the expected cloud-hosted `seipass/depo-ui` `publish.yml` workflow with `id-token: write`, npm 11.15.0 or newer, and either Trusted Publishing OIDC context or a bootstrap granular access token held only by the protected environment.
6. Provenance is required for public packages. Trusted Publishing is the long-term path; the bootstrap token is removed and revoked after the initial package creation and a verified OIDC release. npm 2FA and token restrictions are enabled only after bootstrap and OIDC verification succeed.

## External prerequisites

- The GitHub repository must be public before provenance-enabled production publish.
- The maintainer must create or own the `depo-ui` npm organization/scope and have package write access with 2FA.
- The `release` GitHub Environment must have required reviewers and, only if bootstrap is needed, the granular `NPM_TOKEN` secret.
- An npm Trusted Publisher must be configured for each package after that package exists in the registry.

## Consequences

- `pnpm add @depo-ui/react` and `import '@depo-ui/react/css'` are the documented consumer path.
- Package tarballs can be inspected and installed in a clean consumer without a workspace link.
- `npm whoami` and `npm view` remain useful external checks but do not prove OIDC identity; the protected GitHub workflow and npm publish response provide the verification boundary.
- Initial package creation can require a temporary bootstrap token because npm Trusted Publisher configuration requires an existing package. No production registry mutation is performed by repository preparation.
