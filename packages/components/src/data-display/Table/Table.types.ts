import type { ComponentPropsWithRef, ReactNode } from 'react';

export type TableRow = readonly ReactNode[];

export type TableProps = Omit<ComponentPropsWithRef<'table'>, 'children' | 'className'> & {
  caption: ReactNode;
  headers: readonly ReactNode[];
  rows?: readonly TableRow[];
  children?: ReactNode;
  className?: string;
};
