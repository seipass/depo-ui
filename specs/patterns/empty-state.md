# Empty state

## Purpose

Distinguish first-use empty, filtered-empty, unavailable, and error conditions while providing a useful next action.

## State and recovery

The state may follow `loading → empty`, `loading → filtered-empty`, or `loading → error`. Offer create, clear filters, or learn-more actions that match the reason for emptiness.

## Composition and accessibility

Compose `EmptyState`, `Button`, and `Link`. Use a heading, meaningful action labels, and an explicit policy for decorative imagery and alternative text.

## Responsive and lifecycle

Allow actions and explanation to wrap in narrow containers. This pattern is `Trial`.
