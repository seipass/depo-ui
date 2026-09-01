import type { ComponentPropsWithRef } from 'react';

export type PaginationProps = Omit<ComponentPropsWithRef<'nav'>, 'children' | 'className'> & {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
};
