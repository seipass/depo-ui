import { componentClassNames } from '../../shared/index.js';
import type { DateInputProps } from './DateInput.types.js';
import { dateInputClassName } from './DateInput.styles.js';

export function DateInput({
  className,
  size = 'md',
  invalid = false,
  disabled = false,
  ref,
  ...props
}: DateInputProps) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={componentClassNames(dateInputClassName, className)}
      data-date-input=""
      data-dui-control=""
      data-invalid={invalid ? 'true' : undefined}
      data-size={size}
      disabled={disabled}
      ref={ref}
      type="date"
    />
  );
}
