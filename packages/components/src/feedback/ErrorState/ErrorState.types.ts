import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ErrorStateProps = Omit<
  ComponentPropsWithRef<'section'>,
  'children' | 'className' | 'title'
> & {
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
};
