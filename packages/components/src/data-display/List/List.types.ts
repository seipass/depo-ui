import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type ListProps = Omit<ComponentPropsWithoutRef<'ul'>, 'children' | 'className'> & {
  children?: ReactNode;
  className?: string;
  ordered?: boolean;
};
