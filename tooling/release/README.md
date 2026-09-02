# Release helpers

`status.mjs` wraps the official Changesets status command. A clean tree with no pending release-intent files is reported as a successful no-op; when a Changeset exists, the official status command validates its release graph.

`publish.mjs` is the final fail-closed boundary. A real publish requires the protected release approval, the expected cloud-hosted GitHub Actions `publish.yml` runtime, and either npm Trusted Publishing OIDC context or a bootstrap granular access token supplied by the `release` environment. A local machine cannot publish by setting the approval flag or a token. It supports an explicit dry-run without touching the registry.

## Trusted Publishing migration

The first public package creation may use a narrowly scoped granular access token stored only as the GitHub `release` environment secret `NPM_TOKEN`. Do not commit the token or write it to `.npmrc`. npm Trusted Publishers can be configured after each package exists:

```bash
npm trust github @depo-ui/react --file publish.yml --repo seipass/depo-ui --env release --allow-publish --yes
```

Repeat the command for every public package in `governance/release/policy.json`. The account needs package write access, 2FA, and npm 11.15.0 or newer for the `npm trust` command. Verify one protected workflow publish, then remove `NPM_TOKEN`, revoke the bootstrap token, and enable npm's 2FA/token restrictions. Trusted Publishing automatically supplies provenance for a public package from the public GitHub repository; the workflow retains `id-token: write`.
