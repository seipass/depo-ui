import type { ElementType } from 'react';
import { classNames, primitiveClasses, type PolymorphicProps } from './styles.js';
import type { DataAttributes } from './types.js';

export type BoxProps<Element extends ElementType = 'div'> = PolymorphicProps<
  Element,
  DataAttributes
>;

export function Box<Element extends ElementType = 'div'>({
  as,
  className,
  ...props
}: BoxProps<Element>) {
  const Component = as ?? 'div';
  return (
    <Component {...props} className={classNames(primitiveClasses.box, className)} data-dui-box="" />
  );
}
