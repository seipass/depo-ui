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
import type { DialogProps } from './Dialog.types.js';
import { dialogClassName } from './Dialog.styles.js';

export function Dialog({
  trigger,
  children,
  title,
  description,
  footer,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeOnOverlayClick = true,
  closeLabel = 'Close dialog',
  className,
  ...props
}: DialogProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const titleId = useStableId('dui-dialog-title');
  const descriptionId = useStableId('dui-dialog-description');
  useScrollLock(open);
  useInertSiblings(rootRef, open);
  const triggerProps = trigger?.props as
    { onClick?: (event: MouseEvent<HTMLElement>) => void } | undefined;

  const triggerWithProps = trigger
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
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
          <div className="dui-dialog-root" data-dui-dialog-root="" ref={rootRef}>
            <div
              aria-hidden="true"
              className="dui-dialog-backdrop"
              data-dui-dialog-backdrop=""
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
                  className={componentClassNames(dialogClassName, className)}
                  data-dui-dialog=""
                  data-state="open"
                  role="dialog"
                >
                  <header className="dui-dialog-header">
                    <div>
                      <h2 className="dui-dialog-title" id={titleId}>
                        {title}
                      </h2>
                      {description ? (
                        <p className="dui-dialog-description" id={descriptionId}>
                          {description}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      aria-label={closeLabel}
                      className="dui-dialog-close"
                      onClick={() => setOpen(false)}
                      variant="ghost"
                    >
                      ×
                    </Button>
                  </header>
                  {children ? <div>{children}</div> : null}
                  {footer ? <footer>{footer}</footer> : null}
                </div>
              </FocusScope>
            </DismissableLayer>
          </div>
        </Portal>
      ) : null}
    </>
  );
}
