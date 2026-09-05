# @depo-ui/tokens

Generated Depo UI reference and semantic token artifacts.

The standard appearance is dark-only. The generated semantic values are emitted at `:root`; appearance switching is not part of this package's public API. OS forced-colors behavior remains an accessibility mode in the foundation CSS.

The package provides generated CSS, JavaScript, TypeScript declarations, and a token manifest:

```css
@import '@depo-ui/tokens/css';
```

Product code should consume semantic tokens through the public foundation and component boundaries rather than importing reference values directly.
