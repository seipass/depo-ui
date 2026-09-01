# Depo UI primitives

Primitives are small React renderers for layout, text, icon, separator, and visibility concerns. They do not own product data, request state, validation rules, or navigation decisions.

## Public contract

- `Box`, `Stack`, `Inline`, `Cluster`, `Grid`, `Container`, `Center`, `Split`, and `Sidebar` provide tokenized layout behavior. Their `gap`, `size`, `width`, and alignment values are finite vocabularies, not arbitrary CSS values.
- `Text` and `Heading` provide semantic typography roles. `Heading` renders the requested native heading level; consumers remain responsible for a meaningful document outline.
- `Icon` renders decorative content as hidden content and requires a label for meaningful standalone content. Named SVG icons come from `@depo-ui/icons`.
- `Divider` uses native `hr` for horizontal separators and a separator role for vertical separators. `VisuallyHidden` is available for accessible text and optional skip-link content.
- `as` is a controlled polymorphism escape hatch for layout and text primitives. It must preserve the resulting element's native semantics; interactive components define their own narrower contract.
- A primitive exposes a ref only when its rendered DOM node is an explicit consumer target. React 19 uses the normal `ref` prop; any React 18 compatibility boundary follows the Phase 0 decision.
- `data-dui-*` and finite `data-*` attributes are an observation surface for styles and tests. They are not a business-state store.

The component and pattern packages consume these primitives. Product-specific names, API models, network state, and domain callbacks belong in examples or consumer applications.
