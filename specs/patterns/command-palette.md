# Command palette

## Purpose

Let a user find and run a command from the keyboard while preserving the page context.

## State and recovery

Use `closed → open → query → result | empty → executing → closed | error`. Keep the query when a command is unavailable or fails, and explain permission boundaries.

## Composition and accessibility

Compose `CommandPalette`, `Combobox`, `Kbd`, and `Dialog`. Ctrl/Cmd+K is supplemental; the surface needs focus scope, active result semantics, Escape, and result announcement.

## Responsive and lifecycle

Use a full-width modal surface on narrow screens and a constrained panel on wide screens. This pattern is `Trial`.
