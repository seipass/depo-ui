import type { ComponentPropsWithRef, ReactNode } from 'react';

export type TabItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  className?: string;
};
