import type { ComponentPropsWithRef, ReactNode } from 'react';

export type SliderProps = Omit<
  ComponentPropsWithRef<'input'>,
  'children' | 'className' | 'defaultValue' | 'onChange' | 'type' | 'value'
> & {
  label: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  invalid?: boolean;
  className?: string;
};
