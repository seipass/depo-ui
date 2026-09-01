# ADR-003: Density model

- Status: Accepted
- Date: 2026-09-01
- Owners: Depo UI Design System maintainers
- Review date: Foundation contract review

## Context

Depo UI serves data-heavy desktop tools and touch-capable responsive applications. One fixed row and control metric cannot serve both without reducing readability or hit target quality.

## Decision

The public density vocabulary is compact, comfortable, and touch. Density is inherited through a data-density attribute and resolves to semantic control height, row height, and gap tokens. Touch density increases the visual metrics while the interaction contract independently enforces the minimum hit target.

Density does not change meaning, order, focus behavior, or error recovery. Components may adapt layout when a container is too narrow, but must not hide required content solely because density changed.

## Consequences

Stories and tests can compare the same component across three explicit modes. Consumers can choose density per subtree without copying component CSS. A new density requires a documented token mapping and all minimum accessibility fixtures.
