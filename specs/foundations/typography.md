# Typography

Typography uses semantic roles instead of component-specific font values. Body, label, heading, and code roles share the UI and monospace fallback stacks from the token source.

## Contract

- UI family order: Inter, Noto Sans JP, Noto Sans, Segoe UI, system-ui, sans-serif.
- Code family order: ui-monospace, SFMono-Regular, Cascadia Code, Roboto Mono, Menlo, monospace.
- Body uses the semantic body size, regular weight, and normal line height.
- Labels use the semantic label size, medium weight, and normal line height.
- Headings use the semantic heading size, semibold weight, and tight line height. Level-specific size is applied by the foundation stylesheet.
- Long-form content can opt into the measure token. Text must wrap or reflow; truncation is only used when the full value is available to assistive technology.
- CJK, mixed Latin/CJK, missing fonts, 200% text resize, and 400% zoom are required fixtures.
- Direction-sensitive alignment and spacing use logical properties so the same contract works in LTR and RTL.
