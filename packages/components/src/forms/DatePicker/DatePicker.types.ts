import type { ComponentPropsWithRef, ReactNode } from 'react';

export type DatePickerProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'className' | 'type' | 'disabled'
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: ReactNode;
  locale?: string;
  min?: string;
  max?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
};
