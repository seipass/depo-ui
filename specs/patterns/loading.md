# Loading

## Purpose

Tell the user what is loading while keeping stable content and layout where possible.

## State and recovery

Use `idle → loading → content | empty | error`; refresh may keep existing content visible. Timeout and error are not represented as an endless skeleton.

## Composition and accessibility

Compose `Skeleton`, `Spinner`, `ProgressBar`, and `InlineMessage`. Provide a status and `aria-busy` where appropriate, and keep required content available.

## Responsive and lifecycle

Reserve space to reduce layout shift and respect reduced motion. This pattern is `Trial`.
