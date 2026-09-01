import { componentClassNames } from '../../shared/index.js';
import type { AvatarProps } from './Avatar.types.js';
import { avatarClassName } from './Avatar.styles.js';

export function Avatar({
  className,
  src,
  alt = '',
  label,
  initials,
  size = 'md',
  ...props
}: AvatarProps) {
  return (
    <span
      {...props}
      aria-label={label}
      className={componentClassNames(avatarClassName, className)}
      data-dui-avatar=""
      data-size={size}
      role={label ? 'img' : undefined}
    >
      {src ? <img alt={alt} src={src} /> : (initials ?? label?.slice(0, 2).toUpperCase())}
    </span>
  );
}
