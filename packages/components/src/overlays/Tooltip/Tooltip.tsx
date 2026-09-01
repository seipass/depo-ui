import {
  cloneElement,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { useStableId } from '@depo-ui/accessibility';
import { Portal } from '@depo-ui/utilities';
import { componentClassNames } from '../../shared/index.js';
import { usePositionedOverlay } from '../shared.js';
import type { TooltipProps } from './Tooltip.types.js';
import { tooltipClassName } from './Tooltip.styles.js';

export function Tooltip({
  trigger,
  children,
  placement = 'top',
  className,
  ...props
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tooltipId = useStableId('dui-tooltip');
  const style = usePositionedOverlay(triggerRef, contentRef, open, placement);
  const triggerProps = trigger.props as {
    onBlur?: (event: FocusEvent<HTMLElement>) => void;
    onFocus?: (event: FocusEvent<HTMLElement>) => void;
    onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  };

  const triggerWithProps = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    'aria-describedby': open ? tooltipId : undefined,
    onBlur: (event: FocusEvent<HTMLElement>) => {
      triggerProps.onBlur?.(event);
      setOpen(false);
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      triggerProps.onFocus?.(event);
      setOpen(true);
    },
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      triggerProps.onMouseEnter?.(event);
      setOpen(true);
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      triggerProps.onMouseLeave?.(event);
      setOpen(false);
    },
    ref: triggerRef,
  });

  return (
    <>
      <span data-dui-tooltip-trigger="">{triggerWithProps}</span>
      {open ? (
        <Portal>
          <div
            {...props}
            className={componentClassNames(tooltipClassName, className)}
            data-dui-tooltip=""
            data-state="open"
            id={tooltipId}
            ref={contentRef}
            role="tooltip"
            style={style}
          >
            {children}
          </div>
        </Portal>
      ) : null}
    </>
  );
}
