import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';

export type DialogProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className' | 'title'> & {
  trigger?: ReactElement;
  children?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOverlayClick?: boolean;
  closeLabel?: string;
  className?: string;
};
