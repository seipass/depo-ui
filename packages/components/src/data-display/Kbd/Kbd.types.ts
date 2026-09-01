import type { ComponentPropsWithRef, ReactNode } from 'react';

export type KbdProps = Omit<ComponentPropsWithRef<'kbd'>, 'children' | 'className'> & {
  children?: ReactNode;
  className?: string;
};
