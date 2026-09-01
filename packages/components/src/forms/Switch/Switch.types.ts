import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ComponentSize, ComponentTone } from '../../shared/types.js';

export type SwitchProps = Omit<
  ComponentPropsWithRef<'input'>,
  'children' | 'className' | 'disabled' | 'size' | 'type' | 'aria-invalid'
> & {
  children?: ReactNode;
  className?: string;
  size?: ComponentSize;
  tone?: ComponentTone;
  invalid?: boolean;
  disabled?: boolean;
};
