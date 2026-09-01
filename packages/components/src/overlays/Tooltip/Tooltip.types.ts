import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import type { OverlayPlacement } from '@depo-ui/utilities';

export type TooltipProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  trigger: ReactElement;
  children: ReactNode;
  placement?: OverlayPlacement;
  className?: string;
};
