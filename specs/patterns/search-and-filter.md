# Search and filter

## Purpose

Help a user narrow a large result set while showing the active query, filters, and result state.

## State and recovery

Use `idle → loading → results | empty | error`. Keep query and filters during retry. Distinguish zero results from a failed request, allow one filter or all filters to be removed, and announce result counts.

## Composition and accessibility

Compose `SearchField`, `Select`, `Combobox`, `Tag`, `List`, or `Table`. Every filter is keyboard reachable and removable, and the result status is available to assistive technology.

## Responsive and lifecycle

Wrap the filter bar and move secondary filters into a Drawer in a narrow container. This pattern is `Trial`.
