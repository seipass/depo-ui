import type { ComponentPropsWithRef, ReactNode } from 'react';

export type Command = {
  id: string;
  label: string;
  description?: ReactNode;
  keywords?: readonly string[];
  disabled?: boolean;
  onSelect?: () => void;
};

export type CommandPaletteProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  commands: readonly Command[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  shortcut?: string;
  className?: string;
};
