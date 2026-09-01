# Responsive navigation

## Purpose

Keep application destinations reachable as the available container, navigation structure, and input method change.

## State and recovery

Transform between `permanent`, `persistent`, and `temporary` navigation without losing the main content. Closing a temporary surface returns focus to its trigger.

## Composition and accessibility

Compose `TopNav`, `SideNav`, `Drawer`, `Menu`, and a skip link. Use named landmarks, an explicit toggle label, Escape, focus return, and visible keyboard focus.

## Responsive and lifecycle

Use container width and input method rather than viewport width alone. This pattern is `Trial`.
