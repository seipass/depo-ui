import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import type { OverlayPlacement } from '@depo-ui/utilities';

export type PopoverProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  trigger: ReactElement;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: OverlayPlacement;
  modal?: boolean;
  className?: string;
};
