# Responsive, adaptive, density, and motion foundations

Depo UI adapts to the available container and content rather than treating viewport width as the only input.

## Layout contract

- Layout uses logical properties and min/max constraints. min-inline-size: 0 is required at flex and grid boundaries that may contain long content.
- Containers use the semantic container limit and allow smaller inline sizes. They never create horizontal scrolling as a default response.
- Grid layouts use tokenized column counts and flexible tracks. Content may wrap, stack, transform into list/detail, or move into a disclosure depending on the task.
- Component-level behavior should use container queries when a component is embedded in a narrow panel. Shell-level fallback breakpoints are allowed only for navigation structure and are documented with the shell contract.
- Density is a subtree attribute: compact, comfortable, or touch. Density changes spacing, row height, and control metrics together.
- Direction is an explicit dir contract. No component assumes left-to-right ordering.

## Motion contract

Feedback, standard, and overlay durations/easing are semantic tokens. Every state transition remains understandable when motion is reduced or disabled. The foundation stylesheet disables scrolling and transition animation under prefers-reduced-motion: reduce; components must not rely on animation completion for focus, error recovery, or status communication.

Required fixtures cover 320 CSS px reflow, 400% zoom, 200% text resize, RTL, CJK, long labels, coarse pointer, forced colors, and reduced motion.
