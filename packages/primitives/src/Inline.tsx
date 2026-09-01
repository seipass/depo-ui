import type { ElementType } from 'react';
import {
  classNames,
  primitiveClasses,
  type PrimitiveAlign,
  type PrimitiveGap,
  type PrimitiveJustify,
  type PolymorphicProps,
} from './styles.js';

type InlineOwnProps = {
  gap?: PrimitiveGap;
  align?: PrimitiveAlign;
  justify?: PrimitiveJustify;
  wrap?: boolean;
};

export type InlineProps<Element extends ElementType = 'div'> = PolymorphicProps<
  Element,
  InlineOwnProps
>;

export function Inline<Element extends ElementType = 'div'>({
  as,
  className,
  gap = 'sm',
  align = 'center',
  justify = 'start',
  wrap = true,
  ...props
}: InlineProps<Element>) {
  const Component = as ?? 'div';
  return (
    <Component
      {...props}
      className={classNames(primitiveClasses.inline, className)}
      data-align={align}
      data-dui-inline=""
      data-gap={gap}
      data-justify={justify}
      data-wrap={wrap ? 'wrap' : 'nowrap'}
    />
  );
}
