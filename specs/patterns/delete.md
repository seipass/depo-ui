# Delete

## Purpose

Require a user to understand the impact of removing a resource before the action runs.

## State and recovery

Use `idle → confirm → deleting → deleted | error`. Confirmation names the target and scope. Failure offers retry; reversible operations offer undo or restore without losing the affected count.

## Composition and accessibility

Compose `Button`, `IconButton`, `Dialog`, and `Toast`. Do not rely on red alone, give the safe action deliberate focus, and make Escape or cancel predictable.

## Responsive and lifecycle

Keep destructive and safe actions in a stable order at every width. This pattern is `Trial`.
