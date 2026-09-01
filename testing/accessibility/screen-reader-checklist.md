# Screen reader checklist

This checklist is manual evidence for the WCAG 2.2 AA gate. Automated Axe and browser checks do not replace it.

## Windows: NVDA with Chromium

- [ ] Navigate every interactive control with Tab and Shift+Tab.
- [ ] Verify each control announces its role, accessible name, state, value, and relationship.
- [ ] Open and close each menu, popover, dialog, drawer, and command surface with the documented keyboard path.
- [ ] Confirm focus enters an overlay, remains scoped when modal, and returns to the invoking control.
- [ ] Confirm validation errors and asynchronous status changes are announced once and provide recovery guidance.
- [ ] Confirm tables, grids, trees, list/detail views, and navigation landmarks expose their intended structure.

## macOS: VoiceOver with Safari

- [ ] Repeat the keyboard and rotor navigation checks for headings, landmarks, forms, tables, and lists.
- [ ] Verify focus and virtual cursor behavior for overlays, dialogs, menus, and disclosure content.
- [ ] Verify dynamic updates, errors, loading, success, and empty states are understandable without sight.
- [ ] Verify long Japanese/CJK labels, localized dates/numbers, and RTL content remain understandable.

## Evidence recording

Record the operating system, browser version, screen reader version, date, component/pattern version, scenario, result, and issue link. A failed manual check blocks Stable status until it has a documented mitigation or an accepted governance decision.
