import type { ComponentPropsWithRef, ReactNode } from 'react';

export type SideNavItem = {
  id: string;
  label: ReactNode;
  href: string;
  current?: boolean;
  disabled?: boolean;
};

export type SideNavProps = Omit<ComponentPropsWithRef<'nav'>, 'children' | 'className'> & {
  items: readonly SideNavItem[];
  label?: string;
  className?: string;
};
