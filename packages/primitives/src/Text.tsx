import type { ElementType } from 'react';
import { classNames, primitiveClasses, type PolymorphicProps } from './styles.js';

type TextOwnProps = {
  tone?: 'primary' | 'secondary' | 'muted' | 'link' | 'inverse';
  size?: 'supporting' | 'body' | 'label';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean;
  measure?: boolean;
};

export type TextProps<Element extends ElementType = 'span'> = PolymorphicProps<
  Element,
  TextOwnProps
>;

export function Text<Element extends ElementType = 'span'>({
  as,
  className,
  tone = 'primary',
  size = 'body',
  weight,
  truncate = false,
  measure = false,
  ...props
}: TextProps<Element>) {
  const Component = as ?? 'span';
  return (
    <Component
      {...props}
      className={classNames(primitiveClasses.text, className)}
      data-dui-text=""
      data-measure={measure ? 'true' : 'false'}
      data-size={size}
      data-tone={tone}
      data-truncate={truncate ? 'true' : 'false'}
      data-weight={weight}
    />
  );
}
