# Migration registry

Every active deprecation maps an old public name to a replacement, release boundaries, a warning, and either an AST-aware codemod or a manual recipe. `button-kind-to-variant` is a deterministic fixture used to verify the migration runner; it is not an assertion that the current Button API exposes `kind`.

The codemod runner only changes the declared Component JSX prop. It does not infer Product data models, rewrite arbitrary strings, or delete the old API. Run it in a branch, inspect the diff, then run the release's complete test matrix. Keep the manual follow-up in the release note even when the codemod succeeds.
