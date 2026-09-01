import type { ComponentPropsWithRef, ReactNode } from 'react';

export type BreadcrumbItem = {
  id: string;
  label: ReactNode;
  href?: string;
  current?: boolean;
};

export type BreadcrumbsProps = Omit<ComponentPropsWithRef<'nav'>, 'children' | 'className'> & {
  items: readonly BreadcrumbItem[];
  label?: string;
  separator?: ReactNode;
  className?: string;
};
