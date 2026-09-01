import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';

export type DataAttributes = {
  [attribute: `data-${string}`]: string | number | boolean | undefined;
};

export type PrimitiveOwnProps = {
  children?: ReactNode;
  className?: string;
};

export type PolymorphicProps<
  Element extends ElementType,
  OwnProps extends object = Record<never, never>,
> = OwnProps &
  PrimitiveOwnProps &
  DataAttributes &
  Omit<ComponentPropsWithRef<Element>, keyof OwnProps | keyof PrimitiveOwnProps | 'as'> & {
    as?: Element;
  };

export type PrimitiveRef<Element extends ElementType> = ComponentPropsWithRef<Element>['ref'];
