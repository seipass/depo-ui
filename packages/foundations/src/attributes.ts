import type { FoundationDensity, FoundationDirection } from './tokens.js';

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
  'data-density': FoundationDensity;
  dir: FoundationDirection;
};

export type FoundationOptions = {
  density: FoundationDensity;
  direction: FoundationDirection;
};

export const foundationAttributes = ({
  density = 'comfortable',
  direction = 'ltr',
}: Partial<FoundationOptions> = {}): FoundationAttributes => ({
  'data-density': density,
  dir: direction,
});

export const isFoundationDensity = (value: string): value is FoundationDensity =>
  foundationDensities.includes(value as FoundationDensity);

export const isFoundationDirection = (value: string): value is FoundationDirection =>
  foundationDirections.includes(value as FoundationDirection);
