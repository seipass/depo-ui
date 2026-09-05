# @depo-ui/foundations

Dark appearance, typography, layout, density, motion, and reset foundations for Depo UI.

Import the foundation stylesheet when building a lower-level integration:

```css
@import '@depo-ui/foundations/css';
```

Depo UI is dark-only, so the stylesheet provides the standard appearance without a theme attribute. Use the exported `foundationAttributes` helper only for `compact`, `comfortable`, or `touch` density and `ltr` / `rtl` direction.
