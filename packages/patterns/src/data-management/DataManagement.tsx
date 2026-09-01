import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  Button,
  DataGrid,
  EmptyState,
  ErrorState,
  Spinner,
  type DataGridColumn,
  type DataGridRow,
} from '@depo-ui/components';

export type DataManagementProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  'children' | 'className'
> & {
  columns: readonly DataGridColumn[];
  rows: readonly DataGridRow[];
  status?: 'idle' | 'fetching' | 'ready' | 'empty' | 'error';
  toolbar?: ReactNode;
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  errorTitle?: ReactNode;
  errorDescription?: ReactNode;
  onRetry?: () => void;
  className?: string;
};

export function DataManagement({
  columns,
  rows,
  status = 'ready',
  toolbar,
  emptyTitle = 'No records yet',
  emptyDescription = 'Create a record to get started.',
  errorTitle = 'Records unavailable',
  errorDescription = 'Check your connection and try again.',
  onRetry,
  className,
  ...props
}: DataManagementProps) {
  const hasData = rows.length > 0;
  return (
    <section
      {...props}
      aria-busy={status === 'fetching' || undefined}
      className={className}
      data-dui-pattern="data-management"
      data-state={status}
    >
      {toolbar ? <div data-dui-pattern-toolbar="">{toolbar}</div> : null}
      {status === 'error' ? (
        <ErrorState
          action={
            onRetry ? (
              <Button onClick={onRetry} variant="outline">
                Retry
              </Button>
            ) : null
          }
          title={errorTitle}
        >
          {errorDescription}
        </ErrorState>
      ) : status === 'empty' || (status === 'ready' && !hasData) ? (
        <EmptyState title={emptyTitle}>
          {emptyDescription}
          {onRetry ? <Button onClick={onRetry}>Refresh</Button> : null}
        </EmptyState>
      ) : status === 'fetching' && !hasData ? (
        <Spinner label="Loading records" />
      ) : (
        <>
          {status === 'fetching' ? <Spinner label="Refreshing records" /> : null}
          <DataGrid columns={columns} rows={rows} />
        </>
      )}
    </section>
  );
}
