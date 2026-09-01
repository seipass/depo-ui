import type { ElementType } from 'react';
import {
  classNames,
  primitiveClasses,
  type PrimitiveAlign,
  type PrimitiveGap,
  type PrimitiveJustify,
  type PolymorphicProps,
} from './styles.js';

type StackOwnProps = {
  gap?: PrimitiveGap;
  align?: PrimitiveAlign;
  justify?: PrimitiveJustify;
};

export type StackProps<Element extends ElementType = 'div'> = PolymorphicProps<
  Element,
  StackOwnProps
>;

export function Stack<Element extends ElementType = 'div'>({
  as,
  className,
  gap = 'md',
  align,
  justify,
  ...props
}: StackProps<Element>) {
  const Component = as ?? 'div';
  return (
    <Component
      {...props}
      className={classNames(primitiveClasses.stack, className)}
      data-align={align}
      data-dui-stack=""
      data-gap={gap}
      data-justify={justify}
    />
  );
}
