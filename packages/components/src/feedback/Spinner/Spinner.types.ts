import type { ComponentPropsWithRef } from 'react';

export type SpinnerProps = Omit<ComponentPropsWithRef<'span'>, 'children' | 'className'> & {
  className?: string;
  label?: string;
};
