# Bulk action

## Purpose

Apply an action to an explicit set of selected records and make partial outcomes recoverable.

## State and recovery

Use `none-selected → some-selected | all-selected → processing → partial | success | error`. Announce scope and count, preserve selection on failure, and offer retry or undo where supported.

## Composition and accessibility

Compose `Checkbox`, `DataGrid` or `List`, `Button`, `Dialog`, and `Toast`. The select-all scope, selected count, progress, and result must be named and keyboard reachable.

## Responsive and lifecycle

Keep the selection action bar usable in narrow containers. This pattern is `Trial`.
