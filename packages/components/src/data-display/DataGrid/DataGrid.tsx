import { useMemo, useState, type KeyboardEvent } from 'react';
import { useStableId } from '@depo-ui/accessibility';
import { componentClassNames, useControllableState } from '../../shared/index.js';
import type { DataGridColumn, DataGridProps, DataGridRow, DataGridSort } from './DataGrid.types.js';
import { dataGridClassName } from './DataGrid.styles.js';

function cellValue(row: DataGridRow, column: DataGridColumn) {
  return column.cell ? column.cell(row) : (row[column.id] ?? '—');
}

export function DataGrid({
  columns,
  rows,
  caption = 'Data grid',
  selectable = false,
  selection: selectionProp,
  defaultSelection = [],
  onSelectionChange,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  onCellEdit,
  emptyMessage = 'No results.',
  className,
  ref,
  ...props
}: DataGridProps) {
  const [selection, setSelection] = useControllableState<readonly string[]>({
    value: selectionProp,
    defaultValue: defaultSelection,
    onChange: onSelectionChange,
  });
  const [sort, setSort] = useControllableState<DataGridSort | null>({
    value: sortProp,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });
  const [editing, setEditing] = useState<{ rowId: string; columnId: string } | null>(null);
  const [draft, setDraft] = useState('');
  const gridId = useStableId('dui-data-grid');
  const displayRows = useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((candidate) => candidate.id === sort.columnId);
    if (!column) return rows;
    return [...rows].sort((left, right) => {
      const leftValue = String(cellValue(left, column));
      const rightValue = String(cellValue(right, column));
      const result = leftValue.localeCompare(rightValue, undefined, { numeric: true });
      return sort.direction === 'ascending' ? result : -result;
    });
  }, [columns, rows, sort]);
  const selectedSet = new Set(selection);
  const allSelected = displayRows.length > 0 && displayRows.every((row) => selectedSet.has(row.id));

  const toggleRow = (rowId: string) => {
    const next = new Set(selection);
    if (next.has(rowId)) next.delete(rowId);
    else next.add(rowId);
    setSelection(Array.from(next));
  };
  const toggleAll = () => setSelection(allSelected ? [] : displayRows.map((row) => row.id));
  const toggleSort = (column: DataGridColumn) => {
    if (!column.sortable) return;
    const next: DataGridSort | null =
      sort?.columnId !== column.id
        ? { columnId: column.id, direction: 'ascending' }
        : sort.direction === 'ascending'
          ? { columnId: column.id, direction: 'descending' }
          : null;
    setSort(next);
  };
  const commitEdit = () => {
    if (!editing) return;
    onCellEdit?.(editing.rowId, editing.columnId, draft);
    setEditing(null);
  };
  const focusCell = (rowIndex: number, columnIndex: number) => {
    if (
      rowIndex < 0 ||
      rowIndex >= displayRows.length ||
      columnIndex < 0 ||
      columnIndex >= columns.length
    )
      return;
    document.getElementById(`${gridId}-cell-${rowIndex}-${columnIndex}`)?.focus();
  };
  const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-dui-grid-cell]');
    if (!target) return;
    const rowIndex = Number(target.dataset.rowIndex);
    const columnIndex = Number(target.dataset.columnIndex);
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusCell(rowIndex, columnIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusCell(rowIndex, columnIndex - 1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusCell(rowIndex + 1, columnIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusCell(rowIndex - 1, columnIndex);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusCell(rowIndex, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusCell(rowIndex, columns.length - 1);
    } else if (event.key === 'Enter' && target.dataset.editable === 'true') {
      event.preventDefault();
      const row = displayRows[rowIndex];
      const column = columns[columnIndex];
      setDraft(String(row && column ? cellValue(row, column) : ''));
      setEditing(row && column ? { rowId: row.id, columnId: column.id } : null);
    }
  };

  return (
    <div
      {...props}
      aria-label={caption}
      aria-multiselectable={selectable || undefined}
      aria-rowcount={displayRows.length + 1}
      aria-colcount={columns.length + (selectable ? 1 : 0)}
      className={componentClassNames(dataGridClassName, className)}
      data-dui-data-grid=""
      onKeyDown={handleGridKeyDown}
      ref={ref}
      role="grid"
    >
      <div aria-rowindex={1} className="dui-data-grid-row" data-dui-data-grid-row="" role="row">
        {selectable ? (
          <div className="dui-data-grid-cell" role="columnheader">
            <input
              aria-label="Select all rows"
              checked={allSelected}
              onChange={toggleAll}
              type="checkbox"
            />
          </div>
        ) : null}
        {columns.map((column) => (
          <div
            aria-sort={sort?.columnId === column.id ? sort.direction : undefined}
            className="dui-data-grid-cell"
            data-pinned={column.pinned}
            key={column.id}
            role="columnheader"
            style={{ inlineSize: column.width }}
          >
            {column.sortable ? (
              <button onClick={() => toggleSort(column)} type="button">
                {column.header}
              </button>
            ) : (
              column.header
            )}
          </div>
        ))}
      </div>
      {displayRows.length ? (
        displayRows.map((row, rowIndex) => (
          <div
            aria-selected={selectable ? selectedSet.has(row.id) : undefined}
            aria-rowindex={rowIndex + 2}
            className="dui-data-grid-row"
            data-dui-data-grid-row=""
            key={row.id}
            role="row"
          >
            {selectable ? (
              <div className="dui-data-grid-cell" role="gridcell">
                <input
                  aria-label={`Select ${row.id}`}
                  checked={selectedSet.has(row.id)}
                  onChange={() => toggleRow(row.id)}
                  type="checkbox"
                />
              </div>
            ) : null}
            {columns.map((column, columnIndex) => {
              const isEditing = editing?.rowId === row.id && editing.columnId === column.id;
              return (
                <div
                  aria-colindex={columnIndex + 1 + (selectable ? 1 : 0)}
                  className="dui-data-grid-cell"
                  data-dui-data-grid-cell=""
                  data-editable={column.editable ? 'true' : undefined}
                  data-pinned={column.pinned}
                  data-column-index={columnIndex}
                  data-row-index={rowIndex}
                  id={`${gridId}-cell-${rowIndex}-${columnIndex}`}
                  key={column.id}
                  onDoubleClick={() => {
                    if (column.editable) {
                      setDraft(String(cellValue(row, column)));
                      setEditing({ rowId: row.id, columnId: column.id });
                    }
                  }}
                  role="gridcell"
                  style={{ inlineSize: column.width }}
                  tabIndex={rowIndex === 0 && columnIndex === 0 ? 0 : -1}
                >
                  {isEditing ? (
                    <input
                      aria-label={`Edit ${String(column.header)}`}
                      autoFocus
                      onBlur={commitEdit}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        event.stopPropagation();
                        if (event.key === 'Enter') commitEdit();
                        if (event.key === 'Escape') setEditing(null);
                      }}
                      value={draft}
                    />
                  ) : (
                    cellValue(row, column)
                  )}
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <div className="dui-data-grid-empty" role="row">
          <div aria-colspan={columns.length + (selectable ? 1 : 0)} role="gridcell">
            {emptyMessage}
          </div>
        </div>
      )}
    </div>
  );
}
