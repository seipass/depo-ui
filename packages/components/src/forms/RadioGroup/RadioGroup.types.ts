import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { ComponentTone } from '../../shared/types.js';

export type RadioGroupProps = Omit<
  ComponentPropsWithoutRef<'fieldset'>,
  'children' | 'className' | 'disabled'
> & {
  children: ReactNode;
  label: ReactNode;
  className?: string;
  tone?: ComponentTone;
  invalid?: boolean;
  disabled?: boolean;
};
