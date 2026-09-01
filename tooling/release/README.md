# Release helpers

`status.mjs` wraps the official Changesets status command. A clean tree with no pending release-intent files is reported as a successful no-op; when a Changeset exists, the official status command validates its release graph.

`publish.mjs` is the final fail-closed boundary. It requires the protected release approval flag and a token supplied by CI, and supports an explicit dry-run without touching the registry.
