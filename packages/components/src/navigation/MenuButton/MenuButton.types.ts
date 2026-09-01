import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { MenuItemData, MenuProps } from '../Menu/Menu.types.js';

export type MenuButtonProps = Omit<MenuProps, 'trigger'> & {
  label: ReactNode;
  buttonProps?: Omit<ComponentPropsWithRef<'button'>, 'children' | 'type'>;
  items: readonly MenuItemData[];
};
