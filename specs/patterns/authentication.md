# Authentication

## Purpose

Support sign-in, verification, recovery, session expiry, and re-authentication with clear, actionable feedback.

## State and recovery

Use `signed-out → authenticating → authenticated | error | expired`. Keep field-specific errors near their fields and link to recovery without discarding valid input.

## Composition and accessibility

Compose `Field`, `Button`, `InlineMessage`, and `Link`. Support autocomplete and password managers, one fact per field, keyboard focus, and accessible authentication requirements.

## Responsive and lifecycle

Use a readable single-column form and preserve error context on narrow screens. This pattern is `Trial`.
