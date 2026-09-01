import type { ElementType } from 'react';
import {
  classNames,
  primitiveClasses,
  type PolymorphicProps,
  type PrimitiveSide,
} from './styles.js';

type SidebarOwnProps = {
  side?: PrimitiveSide;
  width?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
  responsive?: boolean;
};

export type SidebarProps<Element extends ElementType = 'div'> = PolymorphicProps<
  Element,
  SidebarOwnProps
>;

export function Sidebar<Element extends ElementType = 'div'>({
  as,
  className,
  side = 'start',
  width = 'md',
  collapsed = false,
  responsive = true,
  ...props
}: SidebarProps<Element>) {
  const Component = as ?? 'div';
  return (
    <Component
      {...props}
      className={classNames(primitiveClasses.sidebar, className)}
      data-collapsed={collapsed ? 'true' : 'false'}
      data-dui-sidebar=""
      data-responsive={responsive ? 'true' : 'false'}
      data-side={side}
      data-width={width}
    />
  );
}
