import type { ComponentPropsWithRef } from 'react';

export type ProgressBarProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  className?: string;
  value?: number;
  label?: string;
};
