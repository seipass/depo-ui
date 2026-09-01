import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Button, Card, EmptyState } from '@depo-ui/components';

export type ListDetailItem = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
};

export type ListDetailProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  'children' | 'className'
> & {
  items: readonly ListDetailItem[];
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectedChange?: (id: string) => void;
  detail?: ReactNode;
  renderDetail?: (id: string) => ReactNode;
  listLabel?: string;
  emptyDetail?: ReactNode;
  layout?: 'split' | 'stacked';
  className?: string;
};

export function ListDetail({
  items,
  selectedId: selectedProp,
  defaultSelectedId,
  onSelectedChange,
  detail,
  renderDetail,
  listLabel = 'Items',
  emptyDetail = 'Select an item to view its details.',
  layout = 'split',
  className,
  ...props
}: ListDetailProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelectedId ?? '');
  const selectedId = selectedProp ?? internalSelected;
  const select = (id: string) => {
    if (selectedProp === undefined) setInternalSelected(id);
    onSelectedChange?.(id);
  };
  const selectedItem = items.find((item) => item.id === selectedId);
  const detailContent = selectedItem ? (renderDetail?.(selectedItem.id) ?? detail) : null;

  return (
    <section
      {...props}
      aria-label="List and detail"
      className={className}
      data-dui-pattern="list-detail"
      data-layout={layout}
    >
      <nav aria-label={listLabel} data-dui-pattern-list="">
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Button
                aria-current={item.id === selectedId ? 'true' : undefined}
                data-selected={item.id === selectedId ? 'true' : undefined}
                onClick={() => select(item.id)}
                variant="ghost"
              >
                {item.label}
                {item.description ? <small>{item.description}</small> : null}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <Card aria-live="polite" data-dui-pattern-detail="">
        {detailContent ?? <EmptyState title="No item selected">{emptyDetail}</EmptyState>}
      </Card>
    </section>
  );
}
