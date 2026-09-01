# Error recovery

## Purpose

Explain a problem and offer the smallest safe next action so the user can resume work.

## State and recovery

Use `error → retry → loading → recovered | error`. Preserve input, query, and selection. The message says what went wrong and how to fix or retry it.

## Composition and accessibility

Compose `ErrorState`, `InlineMessage`, `Button`, and `Link`. Separate page, section, and field errors, use a heading, and choose alert or status semantics deliberately.

## Responsive and lifecycle

Keep the affected context and recovery action visible at every width. This pattern is `Trial`.
