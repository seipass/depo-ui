import type { ComponentPropsWithRef, ReactNode } from 'react';

export type TreeNode = {
  id: string;
  label: ReactNode;
  children?: readonly TreeNode[];
  disabled?: boolean;
};

export type TreeProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  nodes: readonly TreeNode[];
  label?: string;
  expanded?: readonly string[];
  defaultExpanded?: readonly string[];
  onExpandedChange?: (ids: readonly string[]) => void;
  selected?: string;
  onSelectedChange?: (id: string) => void;
  className?: string;
};
