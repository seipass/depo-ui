# Iconography foundation

Icons are functional UI content. The icon package owns the source SVGs and exports named React icons; Foundations owns the vocabulary that every icon must follow.

## Contract

- Public sizes are `sm`, `md`, and `lg`, resolved through `size.icon.*` semantic tokens. Component-specific icon sizes require a documented slot contract.
- Icons use a consistent viewBox and stroke treatment. The icon source must not contain a hard-coded product color; the rendered icon inherits the semantic foreground role from its parent slot.
- Names are noun/verb based and grouped under `actions`, `navigation`, `status`, `objects`, or `system`. An icon name is not reused for different meanings.
- Decorative icons are hidden from assistive technology. Meaningful standalone icons require an accessible name from the surrounding control or an explicit label.
- Deprecated icons retain a replacement mapping and migration note in the icon metadata. Removing an icon follows the repository lifecycle and release policy.
- RTL-aware icons either mirror through metadata or use a direction-neutral shape. The decision is recorded per icon rather than inferred from its filename.

The Phase 3 Icon primitive consumes this contract. Foundation browser fixtures verify inherited color, size slots, RTL behavior, and decorative/meaningful labeling once the primitive exists.
