import type { ComponentPropsWithRef } from 'react';
import type { ComponentSize } from '../../shared/types.js';

export type NumberInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'className' | 'disabled' | 'size' | 'type' | 'aria-invalid'
> & {
  className?: string;
  size?: ComponentSize;
  invalid?: boolean;
  disabled?: boolean;
};
