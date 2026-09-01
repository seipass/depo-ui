# Accessibility operations

The formal accessibility contract is in `specs/foundations/accessibility.md`. This directory explains how maintainers operate the contract during implementation and release.

## Verification loop

1. Run `pnpm a11y:report` when the coverage map changes.
2. Run `pnpm a11y:check` to validate the map, checklist, and generated report.
3. Run `pnpm test:a11y` for the unit, interaction, and contract suite.
4. Run `pnpm test:visual` for the Chromium browser matrix.
5. Configure the Storybook a11y addon with `testing/accessibility/storybook-config.mjs` and record NVDA/Chromium and VoiceOver/Safari results in the manual checklist evidence system before a Stable transition.

The generated report is `testing/accessibility/known-limitations.generated.md`. Do not edit it directly; update the coverage map or the manual checklist source instead.
