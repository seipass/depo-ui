# Component evidence registry

`components.json` is the governance metadata boundary for every file matched by `specs/components/**/*.json`. The `defaults` record describes the current repository state: Components are `Trial`, automated checks exist, and production usage, manual screen-reader evidence, and named Stable approvals are not yet established.

Use `overrides` only when a Component has evidence that differs from the default. An override must retain every required field; partial or undocumented evidence is rejected by `pnpm governance:check`. Evidence values should link to a review, issue, test report, pilot, or release record that a maintainer can inspect. Do not mark `stableEligible` true until the full lifecycle gate in `governance/lifecycle/policy.json` is satisfied.

This registry is intentionally separate from generated Docs and Figma mappings. The Component JSON remains the source for the public contract (`lifecycle` and `owner`); this registry records the operational evidence used to decide whether that contract may advance.
