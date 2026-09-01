import type { ComponentPropsWithoutRef } from 'react';
import { classNames, primitiveClasses } from './styles.js';

export type DividerProps = Omit<ComponentPropsWithoutRef<'hr'>, 'aria-orientation'> & {
  orientation?: 'horizontal' | 'vertical';
};

export function Divider({ orientation = 'horizontal', className, ...props }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        {...props}
        aria-orientation="vertical"
        className={classNames(primitiveClasses.divider, className)}
        data-dui-divider=""
        data-orientation="vertical"
        role="separator"
      />
    );
  }

  return (
    <hr
      {...props}
      className={classNames(primitiveClasses.divider, className)}
      data-dui-divider=""
      data-orientation="horizontal"
    />
  );
}
