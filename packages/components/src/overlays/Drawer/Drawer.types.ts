import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';

export type DrawerProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  trigger?: ReactElement;
  children?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'start' | 'end' | 'bottom';
  closeOnOverlayClick?: boolean;
  closeLabel?: string;
  className?: string;
};
