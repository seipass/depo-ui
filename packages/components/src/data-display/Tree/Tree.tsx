import { useRef, type KeyboardEvent } from 'react';
import { useStableId } from '@depo-ui/accessibility';
import { componentClassNames, mergeRefs, useControllableState } from '../../shared/index.js';
import type { TreeNode, TreeProps } from './Tree.types.js';
import { treeClassName } from './Tree.styles.js';

function flattenVisible(
  nodes: readonly TreeNode[],
  expanded: Set<string>,
  level = 1,
): Array<{ node: TreeNode; level: number }> {
  return nodes.flatMap((node) => [
    { node, level },
    ...(node.children && expanded.has(node.id)
      ? flattenVisible(node.children, expanded, level + 1)
      : []),
  ]);
}

function encodeNodeId(id: string) {
  return encodeURIComponent(id);
}

function TreeItem({
  node,
  level,
  expanded,
  selected,
  onToggle,
  onSelect,
  onKeyDown,
  rootId,
}: {
  node: TreeNode;
  level: number;
  expanded: Set<string>;
  selected?: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>, id: string) => void;
  rootId: string;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expanded.has(node.id);
  return (
    <>
      <div
        aria-disabled={node.disabled || undefined}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-level={level}
        aria-selected={node.id === selected}
        className="dui-tree-item"
        data-disabled={node.disabled ? 'true' : undefined}
        data-dui-tree-item=""
        id={`${rootId}-${encodeNodeId(node.id)}`}
        onClick={() => {
          if (!node.disabled) onSelect(node.id);
        }}
        onKeyDown={(event) => onKeyDown(event, node.id)}
        role="treeitem"
        tabIndex={node.id === selected ? 0 : -1}
      >
        {hasChildren ? (
          <button
            aria-label={
              isExpanded ? `Collapse ${String(node.label)}` : `Expand ${String(node.label)}`
            }
            className="dui-tree-toggle"
            onClick={(event) => {
              event.stopPropagation();
              if (!node.disabled) onToggle(node.id);
            }}
            tabIndex={-1}
            type="button"
          >
            {isExpanded ? '−' : '+'}
          </button>
        ) : (
          <span aria-hidden="true" className="dui-tree-spacer" />
        )}
        <span>{node.label}</span>
      </div>
      {hasChildren && isExpanded ? (
        <div role="group">
          {node.children?.map((child) => (
            <TreeItem
              expanded={expanded}
              key={child.id}
              level={level + 1}
              node={child}
              onKeyDown={onKeyDown}
              onSelect={onSelect}
              onToggle={onToggle}
              rootId={rootId}
              selected={selected}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}

export function Tree({
  nodes,
  label = 'Tree',
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  selected: selectedProp,
  onSelectedChange,
  className,
  ref,
  ...props
}: TreeProps) {
  const [expandedIds, setExpandedIds] = useControllableState<readonly string[]>({
    value: expandedProp,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });
  const [selected, setSelected] = useControllableState<string>({
    value: selectedProp,
    defaultValue: '',
    onChange: onSelectedChange,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const rootId = useStableId('dui-tree');
  const expanded = new Set(expandedIds);
  const visible = flattenVisible(nodes, expanded);
  const setExpanded = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(Array.from(next));
  };
  const focusItem = (index: number) => {
    const target = visible[(index + visible.length) % Math.max(visible.length, 1)];
    if (target) document.getElementById(`${rootId}-${encodeNodeId(target.node.id)}`)?.focus();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, id: string) => {
    const index = visible.findIndex((entry) => entry.node.id === id);
    const current = visible[index]?.node;
    if (!current) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusItem(index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusItem(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusItem(visible.length - 1);
    } else if (event.key === 'ArrowRight' && current.children?.length && !expanded.has(id)) {
      event.preventDefault();
      setExpanded(id);
    } else if (event.key === 'ArrowLeft' && expanded.has(id)) {
      event.preventDefault();
      setExpanded(id);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!current.disabled) setSelected(id);
    }
  };

  return (
    <div
      {...props}
      aria-label={label}
      className={componentClassNames(treeClassName, className)}
      data-dui-tree=""
      onKeyDown={(event) => {
        if (event.target === event.currentTarget && event.key === 'ArrowDown') {
          event.preventDefault();
          focusItem(0);
        }
      }}
      ref={mergeRefs(rootRef, ref)}
      role="tree"
      tabIndex={selected ? -1 : 0}
    >
      {nodes.map((node) => (
        <TreeItem
          expanded={expanded}
          key={node.id}
          level={1}
          node={node}
          onKeyDown={handleKeyDown}
          onSelect={setSelected}
          onToggle={setExpanded}
          rootId={rootId}
          selected={selected}
        />
      ))}
    </div>
  );
}
