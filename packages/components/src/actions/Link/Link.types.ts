import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ComponentSize, ComponentTone, ComponentVariant } from '../../shared/types.js';

export type LinkProps = Omit<
  ComponentPropsWithRef<'a'>,
  'children' | 'className' | 'aria-disabled'
> & {
  children?: ReactNode;
  className?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  tone?: ComponentTone;
  disabled?: boolean;
};
