import type { ElementType } from 'react';
import {
  classNames,
  primitiveClasses,
  type PrimitiveAlign,
  type PrimitiveGap,
  type PrimitiveJustify,
  type PolymorphicProps,
} from './styles.js';

type ClusterOwnProps = {
  gap?: PrimitiveGap;
  align?: PrimitiveAlign;
  justify?: PrimitiveJustify;
};

export type ClusterProps<Element extends ElementType = 'div'> = PolymorphicProps<
  Element,
  ClusterOwnProps
>;

export function Cluster<Element extends ElementType = 'div'>({
  as,
  className,
  gap = 'sm',
  align = 'center',
  justify = 'start',
  ...props
}: ClusterProps<Element>) {
  const Component = as ?? 'div';
  return (
    <Component
      {...props}
      className={classNames(primitiveClasses.cluster, className)}
      data-align={align}
      data-dui-cluster=""
      data-gap={gap}
      data-justify={justify}
    />
  );
}
