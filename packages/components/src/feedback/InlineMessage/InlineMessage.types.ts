import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ComponentTone } from '../../shared/types.js';

export type InlineMessageProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'role'
> & {
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
  tone?: Extract<ComponentTone, 'neutral' | 'info' | 'success' | 'warning' | 'danger'>;
};
