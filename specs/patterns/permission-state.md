# Permission state

## Purpose

Explain whether access is being checked, allowed, limited, or denied and what the user can do next.

## State and recovery

Use `checking → allowed | limited | denied`. Offer request access, switch account, or learn more without leaking sensitive information.

## Composition and accessibility

Compose `Banner`, `InlineMessage`, `Button`, and `Link`. Explain disabled or unavailable actions in text; do not make `aria-disabled` the only reason.

## Responsive and lifecycle

Keep the reason and next action visible at every width. This pattern is `Trial`.
