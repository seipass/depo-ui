import type { ComponentPropsWithRef, ReactNode } from 'react';

export type EmptyStateProps = Omit<
  ComponentPropsWithRef<'section'>,
  'children' | 'className' | 'title'
> & {
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
};
