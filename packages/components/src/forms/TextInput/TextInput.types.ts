import type { ComponentPropsWithRef } from 'react';
import type { ComponentSize } from '../../shared/types.js';

export type TextInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'disabled' | 'size' | 'aria-invalid'
> & {
  className?: string;
  size?: ComponentSize;
  invalid?: boolean;
  disabled?: boolean;
};
