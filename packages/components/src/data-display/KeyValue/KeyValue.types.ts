import type { ComponentPropsWithRef, ReactNode } from 'react';

export type KeyValueItem = { label: ReactNode; value: ReactNode };

export type KeyValueProps = Omit<ComponentPropsWithRef<'dl'>, 'children' | 'className'> & {
  items: readonly KeyValueItem[];
  className?: string;
};
