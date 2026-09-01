# Documentation Architecture

The Docs Site is a human-readable projection of the repository sources. Formal rules remain in `specs/`; editorial explanations remain in `apps/docs/content/`; generated reference pages are produced from metadata and are never edited by hand.

## Generation boundary

Run `pnpm docs:generate` to read Component and Pattern metadata, Stories, the token manifest, and the Figma mapping. The generator writes generated MDX, a search index, a parity manifest, and a deterministic browser preview under the generated directories. Each generated file carries a marker and source paths.

The Docusaurus app consumes the generated MDX from `apps/docs/content/generated/` and the hand-authored MDX pages beside it. Its broken-link policy fails the build. `pnpm docs:check` validates the source paths, generated markers, counts, search uniqueness, and preview landmarks before the site build.

## Editing rule

Change the JSON specification, Component Story, Pattern narrative, token source, or Figma mapping source that owns the information. Do not patch generated API tables, search data, or previews. This keeps a new Component addition discoverable through the same metadata pipeline used by testing and Figma parity.

## Accessibility and examples

The site itself follows the repository WCAG 2.2 AA baseline. The Examples page exercises dark, light, high-contrast, RTL, density, reduced motion, narrow containers, long labels, and CJK content. The browser fixture checks keyboard focus, landmarks, headings, search labeling, and reflow.
