import type { ComponentPropsWithRef, ReactNode } from 'react';

export type DisclosureProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  title: ReactNode;
  children: ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  disabled?: boolean;
  className?: string;
};
