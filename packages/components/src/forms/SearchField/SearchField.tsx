import { componentClassNames } from '../../shared/index.js';
import type { SearchFieldProps } from './SearchField.types.js';
import { searchFieldClassName } from './SearchField.styles.js';

export function SearchField({
  className,
  size = 'md',
  invalid = false,
  disabled = false,
  ref,
  ...props
}: SearchFieldProps) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={componentClassNames(searchFieldClassName, className)}
      data-dui-control=""
      data-dui-search-field=""
      data-invalid={invalid ? 'true' : undefined}
      data-size={size}
      disabled={disabled}
      ref={ref}
      type="search"
    />
  );
}
