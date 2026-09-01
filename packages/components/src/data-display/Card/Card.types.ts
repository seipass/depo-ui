import type { ComponentPropsWithRef, ReactNode } from 'react';

export type CardProps = Omit<ComponentPropsWithRef<'article'>, 'children' | 'className'> & {
  children?: ReactNode;
  className?: string;
};
