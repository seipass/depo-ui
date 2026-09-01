import type { ElementType } from 'react';
import {
  classNames,
  primitiveClasses,
  type PolymorphicProps,
  type PrimitiveGap,
} from './styles.js';

type SplitOwnProps = {
  gap?: PrimitiveGap;
  ratio?: 'equal' | 'main' | 'side';
};

export type SplitProps<Element extends ElementType = 'div'> = PolymorphicProps<
  Element,
  SplitOwnProps
>;

export function Split<Element extends ElementType = 'div'>({
  as,
  className,
  gap = 'md',
  ratio = 'equal',
  ...props
}: SplitProps<Element>) {
  const Component = as ?? 'div';
  return (
    <Component
      {...props}
      className={classNames(primitiveClasses.split, className)}
      data-dui-split=""
      data-gap={gap}
      data-ratio={ratio}
    />
  );
}
