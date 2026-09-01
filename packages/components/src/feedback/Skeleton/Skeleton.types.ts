import type { ComponentPropsWithRef } from 'react';

export type SkeletonProps = Omit<ComponentPropsWithRef<'div'>, 'className'> & {
  className?: string;
};
