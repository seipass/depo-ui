import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ComponentSize, ComponentTone } from '../../shared/types.js';

export type SegmentOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  options: readonly SegmentOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: ComponentSize;
  tone?: ComponentTone;
  ariaLabel?: string;
  className?: string;
};
