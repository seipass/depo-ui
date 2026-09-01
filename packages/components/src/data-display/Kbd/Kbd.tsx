import { componentClassNames } from '../../shared/index.js';
import type { KbdProps } from './Kbd.types.js';
import { kbdClassName } from './Kbd.styles.js';

export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd {...props} className={componentClassNames(kbdClassName, className)} data-dui-kbd="">
      {children}
    </kbd>
  );
}
