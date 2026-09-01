import { componentClassNames } from '../../shared/index.js';
import type { ListProps } from './List.types.js';
import { listClassName } from './List.styles.js';

export function List({ children, className, ordered = false, ...props }: ListProps) {
  const Element = ordered ? 'ol' : 'ul';
  return (
    <Element {...props} className={componentClassNames(listClassName, className)} data-dui-list="">
      {children}
    </Element>
  );
}
