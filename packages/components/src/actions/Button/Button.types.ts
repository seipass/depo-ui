import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ComponentSize, ComponentTone, ComponentVariant } from '../../shared/types.js';

export type ButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'className' | 'disabled'
> & {
  children?: ReactNode;
  className?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  tone?: ComponentTone;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: ReactNode;
};
