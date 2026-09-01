import type { ComponentPropsWithRef, ReactNode } from 'react';

export type DataGridRow = {
  id: string;
  [key: string]: ReactNode;
};

export type DataGridColumn = {
  id: string;
  header: ReactNode;
  sortable?: boolean;
  editable?: boolean;
  pinned?: 'start' | 'end';
  width?: string;
  cell?: (row: DataGridRow) => ReactNode;
};

export type DataGridSort = {
  columnId: string;
  direction: 'ascending' | 'descending';
};

export type DataGridProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  columns: readonly DataGridColumn[];
  rows: readonly DataGridRow[];
  caption?: string;
  selectable?: boolean;
  selection?: readonly string[];
  defaultSelection?: readonly string[];
  onSelectionChange?: (ids: readonly string[]) => void;
  sort?: DataGridSort | null;
  defaultSort?: DataGridSort | null;
  onSortChange?: (sort: DataGridSort | null) => void;
  onCellEdit?: (rowId: string, columnId: string, value: string) => void;
  emptyMessage?: ReactNode;
  className?: string;
};
