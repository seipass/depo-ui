import type { SemanticTokenName, ThemeName } from '@depo-ui/tokens';

export type FoundationTheme = ThemeName;
export type FoundationDensity = 'compact' | 'comfortable' | 'touch';
export type FoundationDirection = 'ltr' | 'rtl';

export const semanticToken = <Name extends SemanticTokenName>(name: Name) =>
  'var(--dui-' +
  name.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase()).replace(/[._]/g, '-') +
  ')';

export const foundationTokens = {
  color: {
    canvas: semanticToken('color.bg.canvas'),
    surface: semanticToken('color.bg.surface'),
    foreground: semanticToken('color.fg.primary'),
    foregroundSecondary: semanticToken('color.fg.secondary'),
    foregroundMuted: semanticToken('color.fg.muted'),
    border: semanticToken('color.border.default'),
    borderFocus: semanticToken('color.border.focus'),
    focusRing: semanticToken('color.focus.ring'),
  },
  typography: {
    bodyFamily: semanticToken('typography.body.family'),
    bodySize: semanticToken('typography.body.size'),
    bodyLineHeight: semanticToken('typography.body.lineHeight'),
    bodyWeight: semanticToken('typography.body.weight'),
    labelFamily: semanticToken('typography.label.family'),
    labelSize: semanticToken('typography.label.size'),
    labelLineHeight: semanticToken('typography.label.lineHeight'),
    labelWeight: semanticToken('typography.label.weight'),
    headingFamily: semanticToken('typography.heading.family'),
    headingSize: semanticToken('typography.heading.size'),
    headingLineHeight: semanticToken('typography.heading.lineHeight'),
    headingWeight: semanticToken('typography.heading.weight'),
    displayWeight: semanticToken('typography.display-large.weight'),
  },
  spacing: {
    page: semanticToken('space.layout.page'),
    section: semanticToken('space.layout.section'),
    panel: semanticToken('space.layout.panel'),
    controlInline: semanticToken('space.control.inline'),
    controlBlock: semanticToken('space.control.block'),
    controlGroup: semanticToken('space.control.group'),
  },
  size: {
    controlSmall: semanticToken('size.control.sm'),
    controlMedium: semanticToken('size.control.md'),
    controlLarge: semanticToken('size.control.lg'),
    touchTarget: semanticToken('size.control.touch'),
  },
  radius: {
    controlSmall: semanticToken('radius.control.sm'),
    controlMedium: semanticToken('radius.control.md'),
    panel: semanticToken('radius.panel'),
    overlay: semanticToken('radius.overlay'),
    pill: semanticToken('radius.pill'),
  },
  border: {
    none: semanticToken('border.width.none'),
    default: semanticToken('border.width.default'),
    strong: semanticToken('border.width.strong'),
  },
  motion: {
    feedbackDuration: semanticToken('motion.duration.feedback'),
    standardDuration: semanticToken('motion.duration.standard'),
    overlayDuration: semanticToken('motion.duration.overlay'),
    standardEasing: semanticToken('motion.easing.standard'),
    emphasizedEasing: semanticToken('motion.easing.emphasized'),
  },
} as const;
