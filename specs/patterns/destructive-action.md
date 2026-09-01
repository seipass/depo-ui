# Destructive action

## Purpose

Explain an irreversible action, its impact, and the safest available alternative before confirmation.

## State and recovery

Use `idle → confirm → processing → complete`. The confirmation states the action, target, impact, and irreversibility. Cancel and an alternative/support path remain available where appropriate.

## Composition and accessibility

Compose `Dialog`, `Button`, and `InlineMessage`. Use dialog semantics, explicit text, safe default focus, and a result announcement rather than color-only feedback.

## Responsive and lifecycle

Keep impact text and action order readable on narrow screens. This pattern is `Trial`.
