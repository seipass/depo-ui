import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ComponentSize, ComponentTone, ComponentVariant } from '../../shared/types.js';

export type IconButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'className' | 'disabled' | 'aria-label'
> & {
  children?: ReactNode;
  className?: string;
  label: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  tone?: ComponentTone;
  disabled?: boolean;
  loading?: boolean;
};
