# Overlay component contracts

Popover, Tooltip, and Dialog consume the small infrastructure helpers in `@depo-ui/accessibility` and `@depo-ui/utilities`. They do not share one universal overlay component.

- Popover is non-modal contextual content and returns focus according to the trigger contract.
- Tooltip is supplementary information. It never carries the only copy of an action or error.
- Dialog is a modal task surface with a labelled dialog, focus containment, focus restoration, inert siblings, Escape dismissal, and scroll locking.

All three use semantic tokens for layer, surface, elevation, motion, and forced-colors behavior. Component metadata in this directory is the input for generated documentation and Figma mapping.
