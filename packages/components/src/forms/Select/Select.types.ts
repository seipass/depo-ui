import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ComponentSize } from '../../shared/types.js';

export type SelectOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type SelectProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'className'> & {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: ReactNode;
  label?: string;
  invalid?: boolean;
  size?: ComponentSize;
  className?: string;
};
