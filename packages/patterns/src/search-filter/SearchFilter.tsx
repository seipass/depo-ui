import {
  useId,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { Button, EmptyState, InlineMessage, SearchField, Tag } from '@depo-ui/components';

export type SearchFilterChip = {
  id: string;
  label: ReactNode;
};

export type SearchFilterProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  'children' | 'className'
> & {
  children?: ReactNode;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  filters?: readonly SearchFilterChip[];
  onRemoveFilter?: (id: string) => void;
  onClearFilters?: () => void;
  onRetry?: () => void;
  resultCount?: number;
  status?: 'idle' | 'loading' | 'results' | 'empty' | 'error';
  label?: string;
  className?: string;
};

export function SearchFilter({
  children,
  query: queryProp,
  defaultQuery = '',
  onQueryChange,
  filters = [],
  onRemoveFilter,
  onClearFilters,
  onRetry,
  resultCount,
  status = 'idle',
  label = 'Search and filter',
  className,
  ...props
}: SearchFilterProps) {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const searchInputId = useId();
  const query = queryProp ?? internalQuery;
  const updateQuery = (next: string) => {
    if (queryProp === undefined) setInternalQuery(next);
    onQueryChange?.(next);
  };

  return (
    <section
      {...props}
      aria-label={label}
      aria-busy={status === 'loading' || undefined}
      className={className}
      data-dui-pattern="search-filter"
      data-state={status}
    >
      <div data-dui-pattern-toolbar="">
        <label htmlFor={searchInputId}>Search</label>
        <SearchField
          id={searchInputId}
          onChange={(event: ChangeEvent<HTMLInputElement>) => updateQuery(event.target.value)}
          value={query}
        />
        {filters.length ? (
          <div aria-label="Active filters" data-dui-pattern-filters="">
            {filters.map((filter) => (
              <Tag
                key={filter.id}
                onRemove={onRemoveFilter ? () => onRemoveFilter(filter.id) : undefined}
                removable={Boolean(onRemoveFilter)}
              >
                {filter.label}
              </Tag>
            ))}
            {onClearFilters ? (
              <Button onClick={onClearFilters} size="sm" variant="link">
                Clear filters
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
      {status === 'loading' ? (
        <div aria-live="polite" role="status">
          Loading results…
        </div>
      ) : status === 'error' ? (
        <InlineMessage title="Results unavailable" tone="danger">
          Check your connection and try again.
          {onRetry ? (
            <Button onClick={onRetry} size="sm" variant="outline">
              Retry
            </Button>
          ) : null}
        </InlineMessage>
      ) : status === 'empty' ? (
        <EmptyState
          action={onClearFilters ? <Button onClick={onClearFilters}>Clear filters</Button> : null}
          title="No results"
        >
          Try a different search or remove a filter.
        </EmptyState>
      ) : (
        <>
          {resultCount !== undefined ? (
            <div aria-live="polite" data-dui-pattern-result-count="">
              {resultCount} results
            </div>
          ) : null}
          {children}
        </>
      )}
    </section>
  );
}
