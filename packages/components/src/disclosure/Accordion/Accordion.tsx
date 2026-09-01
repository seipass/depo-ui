import { useStableId } from '@depo-ui/accessibility';
import { componentClassNames, mergeRefs, useControllableState } from '../../shared/index.js';
import { useRef } from 'react';
import type { AccordionItem, AccordionProps } from './Accordion.types.js';
import { accordionClassName } from './Accordion.styles.js';

function normalizeValue(
  value: string | readonly string[] | undefined,
  type: 'single' | 'multiple',
) {
  if (!value) return type === 'single' ? '' : [];
  return type === 'single'
    ? String(Array.isArray(value) ? (value[0] ?? '') : value)
    : [...(Array.isArray(value) ? value : [value])];
}

export function Accordion({
  items,
  type = 'multiple',
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  ref,
  ...props
}: AccordionProps) {
  const initial = normalizeValue(defaultValue, type);
  const [value, setValue] = useControllableState<string | readonly string[]>({
    value: valueProp,
    defaultValue: initial,
    onChange: onValueChange,
  });
  const expandedIds = new Set(Array.isArray(value) ? value : value ? [value] : []);
  const accordionId = useStableId('dui-accordion');
  const rootRef = useRef<HTMLDivElement>(null);
  const setExpanded = (id: string) => {
    if (type === 'single') {
      setValue(expandedIds.has(id) ? '' : id);
      return;
    }
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setValue(Array.from(next));
  };
  const focusHeader = (index: number) => {
    const buttons = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>('[data-dui-accordion-header]') ?? [],
    );
    buttons[(index + buttons.length) % buttons.length]?.focus();
  };

  return (
    <div
      {...props}
      className={componentClassNames(accordionClassName, className)}
      data-dui-accordion=""
      data-type={type}
      ref={mergeRefs(rootRef, ref)}
    >
      {items.map((item: AccordionItem, index) => {
        const expanded = expandedIds.has(item.id);
        const triggerId = `${accordionId}-${item.id}-trigger`;
        const contentId = `${accordionId}-${item.id}-content`;
        return (
          <section data-expanded={expanded ? 'true' : undefined} key={item.id}>
            <h3>
              <button
                aria-controls={contentId}
                aria-expanded={expanded}
                data-dui-accordion-header=""
                disabled={item.disabled}
                id={triggerId}
                onClick={() => setExpanded(item.id)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    focusHeader(index + 1);
                  } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    focusHeader(index - 1);
                  } else if (event.key === 'Home') {
                    event.preventDefault();
                    focusHeader(0);
                  } else if (event.key === 'End') {
                    event.preventDefault();
                    focusHeader(items.length - 1);
                  }
                }}
                type="button"
              >
                {item.title}
              </button>
            </h3>
            <div
              aria-labelledby={triggerId}
              hidden={!expanded}
              id={contentId}
              role="region"
              tabIndex={-1}
            >
              {item.content}
            </div>
          </section>
        );
      })}
    </div>
  );
}
