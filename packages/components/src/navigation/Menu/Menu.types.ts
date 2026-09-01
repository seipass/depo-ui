import type { ComponentPropsWithRef, ReactNode, ReactElement } from 'react';
import type { OverlayPlacement } from '@depo-ui/utilities';
import type { ComponentSize, ComponentTone } from '../../shared/types.js';

export type MenuItemData = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  tone?: ComponentTone;
};

export type MenuProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  trigger: ReactElement;
  items: readonly MenuItemData[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: OverlayPlacement;
  label?: string;
  size?: ComponentSize;
  modal?: boolean;
  className?: string;
};
