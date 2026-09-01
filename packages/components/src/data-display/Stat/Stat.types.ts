import type { ComponentPropsWithRef, ReactNode } from 'react';

export type StatProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  label: ReactNode;
  value: ReactNode;
  change?: ReactNode;
  className?: string;
};
