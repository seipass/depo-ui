# Async action

## Purpose

Show what a background or remote action is doing and what outcome it produced.

## State and recovery

Use `idle → pending → success | warning | error`. A cancellable operation exposes cancel; partial success names what remains and offers retry without claiming total success.

## Composition and accessibility

Compose `Button`, `ProgressBar`, and `InlineMessage`. Use `aria-busy`, live status, and text that communicates progress when motion is reduced or unavailable.

## Responsive and lifecycle

Keep progress and recovery discoverable in constrained containers. This pattern is `Trial`.
