import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ComponentSize, ComponentTone, ComponentVariant } from '../../shared/types.js';

export type ToggleButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'className' | 'disabled'
> & {
  children?: ReactNode;
  className?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  tone?: ComponentTone;
  disabled?: boolean;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
};
