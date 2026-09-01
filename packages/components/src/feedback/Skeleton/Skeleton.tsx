import { componentClassNames } from '../../shared/index.js';
import type { SkeletonProps } from './Skeleton.types.js';
import { skeletonClassName } from './Skeleton.styles.js';

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={componentClassNames(skeletonClassName, className)}
      data-dui-skeleton=""
    />
  );
}
