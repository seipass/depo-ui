# Data management

## Purpose

Support browsing, sorting, filtering, pagination, and detail inspection without losing the current data context.

## State and recovery

Use `idle → fetching → ready | empty | error`. Preserve query and selection during retry, identify stale data, and provide a detail alternative when a row cannot fit.

## Composition and accessibility

Compose `Table` for semantic static data and `DataGrid` only for interactive grid behavior, with `SearchField`, `Select`, `Pagination`, and `Drawer` as needed. Keep table/grid semantics distinct and expose keyboard navigation.

## Responsive and lifecycle

Prioritize columns and provide row detail in narrow containers. This pattern is `Trial`.
