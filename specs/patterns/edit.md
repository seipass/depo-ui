# Edit

## Purpose

Make it clear when an existing resource is being edited, changed, saved, or left with unsaved work.

## State and recovery

Use `view → editing → dirty → saving → saved | error`. Conflict errors expose enough information to reload or merge while keeping the local draft available.

## Composition and accessibility

Compose `Field`, `Button`, and `Banner`. The dirty and saving states are announced, controls remain keyboard operable, and long values are not hidden by truncation.

## Responsive and lifecycle

Reflow the action bar without hiding the primary save action. This pattern is `Trial`.
