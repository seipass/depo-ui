import { componentClassNames } from '../../shared/index.js';
import type { TagProps } from './Tag.types.js';
import { tagClassName } from './Tag.styles.js';

export function Tag({
  children,
  className,
  size = 'md',
  tone = 'neutral',
  removable = false,
  removeLabel = 'Remove',
  onRemove,
  ...props
}: TagProps) {
  return (
    <span
      {...props}
      className={componentClassNames(tagClassName, className)}
      data-dui-tag=""
      data-size={size}
      data-tone={tone}
    >
      <span>{children}</span>
      {removable ? (
        <button
          aria-label={removeLabel}
          className="dui-tag-remove"
          onClick={onRemove}
          type="button"
        >
          ×
        </button>
      ) : null}
    </span>
  );
}
