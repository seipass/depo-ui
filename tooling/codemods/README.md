# Codemods

`run.mjs` is the narrow, AST-aware migration runner. A registry entry names the Component, old and replacement prop, release boundaries, warning, and manual follow-up. The runner changes only the matching JSX attribute on that Component; it does not rewrite arbitrary identifiers, strings, Product data, or comments.

Example:

```text
node tooling/codemods/run.mjs --migration button-kind-to-variant --input src/Example.tsx --output src/Example.migrated.tsx
```

Always review the generated diff and run the release's keyboard, accessibility, visual, responsive, localization, and consumer checks. A codemod is an accelerator, not evidence that a migration is complete.
