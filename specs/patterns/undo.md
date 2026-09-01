# Undo

## Purpose

Offer a short, reversible recovery window after a completed action without interrupting the user.

## State and recovery

Use `completed → undo-window → restored | expired`. If undo fails, resynchronize state and provide another recovery path rather than losing the original data.

## Composition and accessibility

Compose `Toast` and `Button`. Use a live region, make timeout behavior understandable, and provide history or another route for users who miss the toast.

## Responsive and lifecycle

Keep the action reachable without moving focus or blocking the page. This pattern is `Trial`.
