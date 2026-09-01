import { getNextRovingId, useStableId, type RovingNavigationKey } from '@depo-ui/accessibility';
import { useControllableState, componentClassNames } from '../../shared/index.js';
import type { TabItem, TabsProps } from './Tabs.types.js';
import { tabsClassName } from './Tabs.styles.js';

export function Tabs({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  className,
  ref,
  ...props
}: TabsProps) {
  const firstEnabled = items.find((item) => !item.disabled)?.id ?? '';
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? firstEnabled,
    onChange: onValueChange,
  });
  const selected = items.find((item) => item.id === value && !item.disabled) ?? items[0];
  const tabsId = useStableId('dui-tabs');
  const tabId = (id: string) => `${tabsId}-tab-${id}`;
  const panelId = (id: string) => `${tabsId}-panel-${id}`;
  const moveFocus = (currentId: string, key: RovingNavigationKey) => {
    const nextId = getNextRovingId(
      items,
      currentId,
      key,
      orientation === 'vertical' ? 'vertical' : 'horizontal',
    );
    if (nextId) {
      document.getElementById(tabId(nextId))?.focus();
      if (activationMode === 'automatic') setValue(nextId);
    }
  };

  return (
    <div
      {...props}
      className={componentClassNames(tabsClassName, className)}
      data-dui-tabs=""
      data-orientation={orientation}
      ref={ref}
    >
      <div
        aria-orientation={orientation}
        className="dui-tabs-list"
        data-dui-tabs-list=""
        role="tablist"
      >
        {items.map((item: TabItem) => (
          <button
            aria-controls={panelId(item.id)}
            aria-selected={item.id === selected?.id}
            className="dui-tab"
            data-disabled={item.disabled ? 'true' : undefined}
            data-selected={item.id === selected?.id ? 'true' : undefined}
            disabled={item.disabled}
            id={tabId(item.id)}
            key={item.id}
            onClick={() => setValue(item.id)}
            onFocus={() => {
              if (activationMode === 'automatic' && !item.disabled) setValue(item.id);
            }}
            onKeyDown={(event) => {
              const previousKey: RovingNavigationKey =
                orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
              const nextKey: RovingNavigationKey =
                orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
              if (event.key === previousKey) {
                event.preventDefault();
                moveFocus(item.id, previousKey);
              } else if (event.key === nextKey) {
                event.preventDefault();
                moveFocus(item.id, nextKey);
              } else if (event.key === 'Home' || event.key === 'End') {
                event.preventDefault();
                moveFocus(item.id, event.key === 'Home' ? 'Home' : 'End');
              } else if (
                activationMode === 'manual' &&
                (event.key === 'Enter' || event.key === ' ')
              ) {
                event.preventDefault();
                setValue(item.id);
              }
            }}
            role="tab"
            tabIndex={item.id === selected?.id ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          aria-labelledby={tabId(item.id)}
          className="dui-tabpanel"
          data-dui-tabpanel=""
          hidden={item.id !== selected?.id}
          id={panelId(item.id)}
          key={item.id}
          role="tabpanel"
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
