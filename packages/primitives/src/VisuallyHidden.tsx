import type { ComponentPropsWithoutRef } from 'react';
import { classNames, primitiveClasses } from './styles.js';

export type VisuallyHiddenProps = Omit<ComponentPropsWithoutRef<'span'>, 'tabIndex'> & {
  focusable?: boolean;
};

export function VisuallyHidden({ focusable = false, className, ...props }: VisuallyHiddenProps) {
  return (
    <span
      {...props}
      className={classNames(primitiveClasses.visuallyHidden, className)}
      data-dui-visually-hidden=""
      data-focusable={focusable ? 'true' : 'false'}
      tabIndex={focusable ? 0 : undefined}
    />
  );
}
