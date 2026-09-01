# Unavailable state

## Purpose

Distinguish deleted, offline, unsupported, and temporarily unavailable resources.

## State and recovery

Use `available → unavailable → retry | alternate`. State the situation, impact, and next action; do not present offline or permission states as generic failures.

## Composition and accessibility

Compose `ErrorState`, `InlineMessage`, `Button`, and `Link`. Use a status heading and named actions, and keep offline-safe actions available.

## Responsive and lifecycle

Keep the explanation readable in constrained containers. This pattern is `Trial`.
