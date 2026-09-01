import { cloneElement, useRef, type MouseEvent, type ReactElement } from 'react';
import {
  DismissableLayer,
  FocusScope,
  useInertSiblings,
  useStableId,
} from '@depo-ui/accessibility';
import { Portal, useScrollLock } from '@depo-ui/utilities';
import { Button } from '../../actions/Button/index.js';
import { componentClassNames, useControllableState } from '../../shared/index.js';
import type { DrawerProps } from './Drawer.types.js';
import { drawerClassName } from './Drawer.styles.js';

export function Drawer({
  trigger,
  children,
  title,
  description,
  footer,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'end',
  closeOnOverlayClick = true,
  closeLabel = 'Close drawer',
  className,
  ...props
}: DrawerProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const titleId = useStableId('dui-drawer-title');
  const descriptionId = useStableId('dui-drawer-description');
  useScrollLock(open);
  useInertSiblings(rootRef, open);
  const triggerProps = trigger?.props as
    { onClick?: (event: MouseEvent<HTMLElement>) => void } | undefined;
  const triggerWithProps = trigger
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        'aria-expanded': open,
        'aria-haspopup': 'dialog',
        onClick: (event: MouseEvent<HTMLElement>) => {
          triggerProps?.onClick?.(event);
          if (!event.defaultPrevented) setOpen(true);
        },
      })
    : null;

  return (
    <>
      {triggerWithProps}
      {open ? (
        <Portal>
          <div className="dui-drawer-root" data-dui-drawer-root="" ref={rootRef}>
            <div
              aria-hidden="true"
              className="dui-drawer-backdrop"
              data-dui-drawer-backdrop=""
              onMouseDown={(event) => {
                if (closeOnOverlayClick && event.target === event.currentTarget) setOpen(false);
              }}
            />
            <DismissableLayer
              onDismiss={() => setOpen(false)}
              onPointerDownOutside={(event) => {
                if (!closeOnOverlayClick) event.preventDefault();
              }}
            >
              <FocusScope autoFocus contain restoreFocus>
                <div
                  {...props}
                  aria-describedby={description ? descriptionId : undefined}
                  aria-labelledby={titleId}
                  aria-modal="true"
                  className={componentClassNames(drawerClassName, className)}
                  data-dui-drawer=""
                  data-side={side}
                  data-state="open"
                  role="dialog"
                >
                  <header className="dui-drawer-header">
                    <div>
                      <h2 className="dui-drawer-title" id={titleId}>
                        {title}
                      </h2>
                      {description ? (
                        <p className="dui-drawer-description" id={descriptionId}>
                          {description}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      aria-label={closeLabel}
                      className="dui-drawer-close"
                      onClick={() => setOpen(false)}
                      variant="ghost"
                    >
                      ×
                    </Button>
                  </header>
                  {children ? <div className="dui-drawer-content">{children}</div> : null}
                  {footer ? <footer className="dui-drawer-footer">{footer}</footer> : null}
                </div>
              </FocusScope>
            </DismissableLayer>
          </div>
        </Portal>
      ) : null}
    </>
  );
}
