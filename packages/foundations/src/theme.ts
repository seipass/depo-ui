import type { FoundationDensity, FoundationDirection, FoundationTheme } from './tokens.js';

export const foundationThemes = [
  'dark',
  'light',
  'high-contrast',
] as const satisfies readonly FoundationTheme[];
export const foundationDensities = [
  'compact',
  'comfortable',
  'touch',
] as const satisfies readonly FoundationDensity[];
export const foundationDirections = [
  'ltr',
  'rtl',
] as const satisfies readonly FoundationDirection[];

export type FoundationAttributes = {
  'data-theme': FoundationTheme;
  'data-density': FoundationDensity;
  dir: FoundationDirection;
};

export type FoundationOptions = {
  theme: FoundationTheme;
  density: FoundationDensity;
  direction: FoundationDirection;
};

export const foundationAttributes = ({
  theme = 'dark',
  density = 'comfortable',
  direction = 'ltr',
}: Partial<FoundationOptions> = {}): FoundationAttributes => ({
  'data-theme': theme,
  'data-density': density,
  dir: direction,
});

export const isFoundationTheme = (value: string): value is FoundationTheme =>
  foundationThemes.includes(value as FoundationTheme);

export const isFoundationDensity = (value: string): value is FoundationDensity =>
  foundationDensities.includes(value as FoundationDensity);

export const isFoundationDirection = (value: string): value is FoundationDirection =>
  foundationDirections.includes(value as FoundationDirection);
