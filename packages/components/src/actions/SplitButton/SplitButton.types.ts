import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ComponentSize, ComponentTone, ComponentVariant } from '../../shared/types.js';
import type { MenuItemData } from '../../navigation/Menu/Menu.types.js';

export type SplitButtonProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'className'> & {
  label: ReactNode;
  items: readonly MenuItemData[];
  variant?: Exclude<ComponentVariant, 'link'>;
  size?: ComponentSize;
  tone?: ComponentTone;
  disabled?: boolean;
  loading?: boolean;
  menuLabel?: string;
  className?: string;
  onClick?: ComponentPropsWithRef<'button'>['onClick'];
};
