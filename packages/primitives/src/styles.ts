export const primitiveClasses = {
  box: 'dui-box',
  stack: 'dui-stack',
  inline: 'dui-inline',
  cluster: 'dui-cluster',
  grid: 'dui-grid',
  container: 'dui-container',
  center: 'dui-center',
  split: 'dui-split',
  sidebar: 'dui-sidebar',
  text: 'dui-text',
  heading: 'dui-heading',
  icon: 'dui-icon-wrapper',
  divider: 'dui-divider',
  visuallyHidden: 'dui-visually-hidden',
} as const;

export type PrimitiveGap = 'none' | 'xs' | 'sm' | 'md' | 'lg';
export type PrimitiveAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type PrimitiveJustify = 'start' | 'center' | 'end' | 'between';
export type PrimitiveGridColumns = 'narrow' | 'medium' | 'expanded';
export type PrimitiveContainerSize = 'sm' | 'md' | 'lg' | 'xl';
export type PrimitiveSide = 'start' | 'end';

export function classNames(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(' ');
}

export type { PolymorphicProps } from './types.js';
