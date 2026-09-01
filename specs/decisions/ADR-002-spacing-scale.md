# ADR-002: Spacing scale

- Status: Accepted
- Date: 2026-09-01
- Owners: Depo UI Design System maintainers
- Review date: Foundation contract review

## Context

Dashboard and data-heavy interfaces need predictable rhythm while still allowing dense tables and touch-friendly controls. An unlimited set of pixel values would make review, theme changes, and Figma parity unreliable.

## Decision

Reference spacing is based on a 4px unit. The 2px hairline is a restricted detail value. Public layout uses semantic spacing aliases, and component styles consume semantic or component tokens rather than raw Reference values. Visual control size and pointer hit target remain separate.

## Consequences

The scale is easy to audit and map to Figma variables. A component that needs a new value must explain its semantic role and update the token contract instead of adding an arbitrary CSS value.
