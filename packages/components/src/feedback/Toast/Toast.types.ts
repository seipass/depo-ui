import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ComponentTone } from '../../shared/types.js';

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  title: ReactNode;
  description?: ReactNode;
  tone?: ComponentTone;
  duration?: number;
  action?: ToastAction;
};

export type ToastProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className' | 'title'> &
  ToastOptions & {
    open?: boolean;
    onClose?: () => void;
    closeLabel?: string;
    className?: string;
  };
