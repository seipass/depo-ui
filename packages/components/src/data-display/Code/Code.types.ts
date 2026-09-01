import type { ComponentPropsWithRef, ReactNode } from 'react';

export type CodeProps = Omit<ComponentPropsWithRef<'code'>, 'children' | 'className'> & {
  children?: ReactNode;
  className?: string;
  block?: boolean;
};
