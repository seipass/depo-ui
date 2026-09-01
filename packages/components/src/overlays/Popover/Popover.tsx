import { cloneElement, useRef, type MouseEvent, type ReactElement } from 'react';
import { DismissableLayer, FocusScope, useStableId } from '@depo-ui/accessibility';
import { Portal } from '@depo-ui/utilities';
import { componentClassNames, useControllableState } from '../../shared/index.js';
import { usePositionedOverlay } from '../shared.js';
import type { PopoverProps } from './Popover.types.js';
import { popoverClassName } from './Popover.styles.js';

export function Popover({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  modal = false,
  className,
  ...props
}: PopoverProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentId = useStableId('dui-popover');
  const positionedStyle = usePositionedOverlay(triggerRef, contentRef, open, placement);
  const triggerProps = trigger.props as {
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  };

  const triggerWithProps = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    'aria-controls': open ? contentId : undefined,
    'aria-expanded': open,
    'aria-haspopup': 'dialog',
    onClick: (event: MouseEvent<HTMLElement>) => {
      triggerProps.onClick?.(event);
      if (!event.defaultPrevented) setOpen(!open);
    },
    ref: triggerRef,
  });

  return (
    <>
      <span data-dui-popover-trigger="">{triggerWithProps}</span>
      {open ? (
        <Portal>
          <DismissableLayer onDismiss={() => setOpen(false)}>
            <FocusScope contain={modal} restoreFocus={modal}>
              <div
                {...props}
                aria-labelledby={contentId}
                className={componentClassNames(popoverClassName, className)}
                data-dui-popover=""
                data-state="open"
                id={contentId}
                ref={contentRef}
                style={positionedStyle}
              >
                {children}
              </div>
            </FocusScope>
          </DismissableLayer>
        </Portal>
      ) : null}
    </>
  );
}
