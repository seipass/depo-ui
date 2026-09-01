# Create

## Purpose

Guide a user through creating a resource with validation, clear progress, and a known destination after success.

## State and recovery

The transition is `idle → editing → submitting → created | error | cancel`. Duplicate, permission, and validation failures explain the next correction or retry and do not erase the draft.

## Composition and accessibility

Compose `Field`, `Dialog` or `Drawer`, `Button`, and `InlineMessage`. Use a labelled form, focus scope, unsaved-change handling, and an announced success or error result.

## Responsive and lifecycle

Use a full-screen form or route on narrow containers and a dialog on wide containers. This pattern is `Trial`.
