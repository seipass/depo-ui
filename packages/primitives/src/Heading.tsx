import type { ElementType } from 'react';
import { classNames, primitiveClasses, type PolymorphicProps } from './styles.js';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingOwnProps = {
  level?: HeadingLevel;
  tone?: 'primary' | 'secondary' | 'muted' | 'link' | 'inverse';
};

export type HeadingProps<Element extends Extract<ElementType, `h${HeadingLevel}`> = 'h2'> =
  PolymorphicProps<Element, HeadingOwnProps>;

export function Heading<Element extends Extract<ElementType, `h${HeadingLevel}`> = 'h2'>({
  as,
  className,
  level = 2,
  tone = 'primary',
  ...props
}: HeadingProps<Element>) {
  const Component = as ?? (`h${level}` as const);
  return (
    <Component
      {...props}
      className={classNames(primitiveClasses.heading, className)}
      data-dui-heading=""
      data-level={level}
      data-tone={tone}
    />
  );
}
