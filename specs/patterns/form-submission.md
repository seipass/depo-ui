# Form submission

## Purpose

Help a user enter valid information, submit it once, and recover from validation or server failure without losing entered values.

## State and recovery

The normal transition is `idle → editing → submitting → success | error`. Field errors return focus or an accessible relation to the affected field. Server errors explain the problem and offer retry or correction while preserving input.

## Composition and accessibility

Compose `Field`, form controls, `Button`, and `InlineMessage`. Labels, required state, error association, submit keyboard behavior, busy state, and success announcement are part of the contract.

## Responsive and lifecycle

Use a single column in narrow containers and keep the primary action visible. This pattern is `Trial` until the Governance Stable gate is satisfied.
