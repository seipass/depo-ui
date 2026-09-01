# List detail

## Purpose

Let a user choose an item and inspect its detail without losing list context or selection.

## State and recovery

Loading and detail errors preserve the selected item. Recovery offers retry or return to the list; it does not silently discard the selection.

## Composition and accessibility

Compose `List`, `Card`, `Drawer`, `Dialog`, or `Pagination`. Expose selected state, a meaningful heading hierarchy, a named back action on narrow layouts, and focus return after an overlay closes.

## Responsive and lifecycle

Use list-to-detail navigation in a narrow container and list plus detail panes in a wide container. This pattern is `Trial`.
