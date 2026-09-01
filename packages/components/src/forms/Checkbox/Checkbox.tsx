import { componentClassNames } from '../../shared/index.js';
import type { CheckboxProps } from './Checkbox.types.js';
import { checkboxClassName } from './Checkbox.styles.js';

export function Checkbox({
  children,
  className,
  size = 'md',
  tone = 'primary',
  invalid = false,
  disabled = false,
  ref,
  ...props
}: CheckboxProps) {
  return (
    <label className={componentClassNames(checkboxClassName, className)} data-dui-checkbox="">
      <input
        {...props}
        aria-invalid={invalid || undefined}
        data-invalid={invalid ? 'true' : undefined}
        data-size={size}
        data-tone={tone}
        disabled={disabled}
        ref={ref}
        type="checkbox"
      />
      <span>{children}</span>
    </label>
  );
}
