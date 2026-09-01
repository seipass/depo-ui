import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { SideNavItem } from '../SideNav/SideNav.types.js';

export type TopNavProps = Omit<ComponentPropsWithRef<'header'>, 'children' | 'className'> & {
  brand: ReactNode;
  items: readonly SideNavItem[];
  actions?: ReactNode;
  label?: string;
  className?: string;
};
