import type { ElementType } from 'react';
import {
  classNames,
  primitiveClasses,
  type PrimitiveAlign,
  type PrimitiveGap,
  type PrimitiveGridColumns,
  type PrimitiveJustify,
  type PolymorphicProps,
} from './styles.js';

type GridOwnProps = {
  columns?: PrimitiveGridColumns;
  gap?: PrimitiveGap;
  align?: PrimitiveAlign;
  justify?: PrimitiveJustify;
  responsive?: boolean;
};

export type GridProps<Element extends ElementType = 'div'> = PolymorphicProps<
  Element,
  GridOwnProps
>;

export function Grid<Element extends ElementType = 'div'>({
  as,
  className,
  columns = 'expanded',
  gap = 'md',
  align,
  justify,
  responsive = true,
  ...props
}: GridProps<Element>) {
  const Component = as ?? 'div';
  return (
    <Component
      {...props}
      className={classNames(primitiveClasses.grid, className)}
      data-align={align}
      data-columns={columns}
      data-dui-grid=""
      data-gap={gap}
      data-justify={justify}
      data-responsive={responsive ? 'true' : 'false'}
    />
  );
}
