import {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { DismissableLayer, FocusScope, useStableId } from '@depo-ui/accessibility';
import { Portal } from '@depo-ui/utilities';
import { componentClassNames, mergeRefs, useControllableState } from '../../shared/index.js';
import { usePositionedOverlay } from '../../overlays/shared.js';
import type { MenuItemData, MenuProps } from './Menu.types.js';
import { menuClassName } from './Menu.styles.js';

function getItems(root: HTMLElement | null) {
  return Array.from(
    root?.querySelectorAll<HTMLElement>('[data-dui-menu-item]:not([disabled])') ?? [],
  );
}

function focusItem(root: HTMLElement | null, index: number) {
  const items = getItems(root);
  if (!items.length) return;
  const next = items[(index + items.length) % items.length];
  next?.focus();
}

export function Menu({
  trigger,
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  label = 'Menu',
  size = 'md',
  modal = true,
  className,
  ...props
}: MenuProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useStableId('dui-menu');
  const style = usePositionedOverlay(triggerRef, menuRef, open, placement);
  const triggerProps = trigger.props as {
    ref?: React.Ref<HTMLElement>;
    'aria-haspopup'?: string;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  };

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => getItems(menuRef.current)[0]?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const itemElements = getItems(menuRef.current);
    const currentIndex = itemElements.indexOf(document.activeElement as HTMLElement);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusItem(menuRef.current, currentIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusItem(menuRef.current, currentIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusItem(menuRef.current, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusItem(menuRef.current, itemElements.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
      triggerRef.current?.focus();
    }
  };

  const triggerWithProps = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    'aria-controls': open ? menuId : undefined,
    'aria-expanded': open,
    'aria-haspopup': triggerProps['aria-haspopup'] ?? 'menu',
    onClick: (event: MouseEvent<HTMLElement>) => {
      triggerProps.onClick?.(event);
      if (!event.defaultPrevented) setOpen(!open);
    },
    ref: mergeRefs(triggerRef, triggerProps.ref),
  });

  return (
    <>
      <span data-dui-menu-trigger="">{triggerWithProps}</span>
      {open ? (
        <Portal>
          <DismissableLayer onDismiss={close}>
            <FocusScope contain={modal} restoreFocus autoFocus>
              <div
                {...props}
                aria-label={label}
                className={componentClassNames(menuClassName, className)}
                data-dui-menu=""
                data-size={size}
                data-state="open"
                id={menuId}
                onKeyDown={handleKeyDown}
                ref={menuRef}
                role="menu"
                style={style}
                tabIndex={-1}
              >
                {items.map((item: MenuItemData) => (
                  <button
                    aria-disabled={item.disabled || undefined}
                    className="dui-menu-item"
                    data-disabled={item.disabled ? 'true' : undefined}
                    data-dui-menu-item=""
                    data-tone={item.tone ?? 'neutral'}
                    disabled={item.disabled}
                    key={item.id}
                    onClick={() => {
                      item.onSelect?.();
                      close();
                    }}
                    role="menuitem"
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </FocusScope>
          </DismissableLayer>
        </Portal>
      ) : null}
    </>
  );
}
