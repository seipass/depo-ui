# Migration operations

Migration entries live in `governance/migrations/registry.json`. Each active entry must provide the old name, replacement, introduction/deprecation/removal versions, warning text, codemod or manual recipe, and follow-up test requirements.

For a previous-version consumer:

1. Copy the consumer into a branch or fixture.
2. Run the matching command from `tooling/codemods/README.md`.
3. Review the diff and resolve Product-specific cases manually.
4. Run keyboard, accessibility, visual, responsive, localization, and consumer tests.
5. Keep rollback or forward-fix instructions available until the support window closes.

The repository's codemod is deliberately narrow and AST-aware. It changes only the registered Component JSX property and never infers business data or deletes a deprecated API.
