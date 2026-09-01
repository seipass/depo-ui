import { Button } from '../../actions/Button/index.js';
import { Menu } from '../Menu/index.js';
import type { MenuButtonProps } from './MenuButton.types.js';

export function MenuButton({ label, buttonProps, ...props }: MenuButtonProps) {
  return <Menu {...props} trigger={<Button {...buttonProps}>{label}</Button>} />;
}
