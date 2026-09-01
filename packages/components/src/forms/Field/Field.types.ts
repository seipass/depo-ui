import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type FieldProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'className' | 'id'> & {
  id?: string;
  label: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  invalid?: boolean;
  required?: boolean;
  children: ReactNode;
  className?: string;
};
