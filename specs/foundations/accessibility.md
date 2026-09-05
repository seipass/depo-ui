# Accessibility foundation

Depo UI targets WCAG 2.2 AA. Accessibility is part of every Component Contract and Pattern contract from the first implementation, not a release-time decoration.

## Shared infrastructure

- `packages/accessibility/src/focus/` owns focus-visible detection, focus scope/trap behavior, focus restoration, dismissable layers, and inert sibling handling.
- `packages/accessibility/src/keyboard/` owns reusable roving tabindex and typeahead calculations. A component supplies its item model and semantic behavior; the utility does not know Product state.
- `packages/accessibility/src/ids/` owns deterministic React IDs and description/error relationships.
- `packages/accessibility/src/live-region/` owns status and alert announcement surfaces. Use `LiveRegion` for React state and `announce` only for plain browser-global announcements.
- `packages/accessibility/src/media/` exposes reduced-motion and forced-colors media preferences. Motion must never be the only carrier of state or recovery information.

## Interaction rules

Use native HTML semantics first. Add ARIA only when the native element cannot express the intended widget. Composite widgets have one Tab stop and use a documented arrow-key, Home/End, or typeahead model. Disabled items are not focus targets unless the Component Contract explicitly requires discoverability.

Focus must remain visible, must not be obscured by Depo UI chrome, and must return to the invoking control when an overlay closes. Modal scopes must contain keyboard focus and expose an accessible name, description, and dismissal path.

## Visual and content rules

Color is never the only indication of state. The standard dark appearance and forced-colors behavior must preserve text, borders, focus, selection, and control affordances. Touch targets use the touch density metric. Text must remain usable at 200% text resize and 400% zoom with 320 CSS px reflow. Long labels, CJK, RTL, and localized dates/numbers are required fixtures for Stable candidates.

## Motion and media preferences

Reduced motion removes non-essential transitions and does not delay focus, errors, recovery, or status announcements. Forced-colors mode uses system-recognized colors and semantic redundancy. Components may consume `useReducedMotion` and `useForcedColors` when behavior, rather than only CSS, must adapt.

## Evidence

The automated baseline is in `testing/accessibility/axe-config.mjs`. The coverage map is `testing/accessibility/coverage-map.json`, and the manual screen-reader evidence procedure is `testing/accessibility/screen-reader-checklist.md`. Automated results are supporting evidence; Stable status additionally requires the manual NVDA/Chromium and VoiceOver/Safari matrix and a recorded issue decision for every gap.
