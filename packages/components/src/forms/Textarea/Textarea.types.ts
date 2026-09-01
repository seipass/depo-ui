import type { ComponentPropsWithRef } from 'react';
import type { ComponentSize } from '../../shared/types.js';

export type TextareaProps = Omit<
  ComponentPropsWithRef<'textarea'>,
  'className' | 'disabled' | 'aria-invalid'
> & {
  className?: string;
  size?: ComponentSize;
  invalid?: boolean;
  disabled?: boolean;
};
