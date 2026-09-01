import type { ComponentPropsWithRef, ReactNode } from 'react';

export type AccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type AccordionProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  items: readonly AccordionItem[];
  type?: 'single' | 'multiple';
  value?: string | readonly string[];
  defaultValue?: string | readonly string[];
  onValueChange?: (value: string | readonly string[]) => void;
  className?: string;
};
