import type { ElementType } from 'react';
import { classNames, primitiveClasses, type PolymorphicProps } from './styles.js';

type CenterOwnProps = {
  intrinsic?: boolean;
};

export type CenterProps<Element extends ElementType = 'div'> = PolymorphicProps<
  Element,
  CenterOwnProps
>;

export function Center<Element extends ElementType = 'div'>({
  as,
  className,
  intrinsic = false,
  ...props
}: CenterProps<Element>) {
  const Component = as ?? 'div';
  return (
    <Component
      {...props}
      className={classNames(primitiveClasses.center, className)}
      data-dui-center=""
      data-intrinsic={intrinsic ? 'true' : 'false'}
    />
  );
}
