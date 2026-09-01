import type { ElementType } from 'react';
import {
  classNames,
  primitiveClasses,
  type PolymorphicProps,
  type PrimitiveContainerSize,
} from './styles.js';

type ContainerOwnProps = {
  size?: PrimitiveContainerSize;
  padding?: 'none' | 'page';
};

export type ContainerProps<Element extends ElementType = 'div'> = PolymorphicProps<
  Element,
  ContainerOwnProps
>;

export function Container<Element extends ElementType = 'div'>({
  as,
  className,
  size = 'xl',
  padding = 'page',
  ...props
}: ContainerProps<Element>) {
  const Component = as ?? 'div';
  return (
    <Component
      {...props}
      className={classNames(primitiveClasses.container, className)}
      data-dui-container=""
      data-padding={padding}
      data-size={size}
    />
  );
}
