import { componentClassNames } from '../../shared/index.js';
import type { RadioGroupProps } from './RadioGroup.types.js';
import { radioGroupClassName } from './RadioGroup.styles.js';

export function RadioGroup({
  children,
  label,
  className,
  tone = 'primary',
  invalid = false,
  disabled = false,
  ...props
}: RadioGroupProps) {
  return (
    <fieldset
      {...props}
      className={componentClassNames(radioGroupClassName, className)}
      data-dui-radio-group=""
      data-invalid={invalid ? 'true' : undefined}
      data-tone={tone}
      disabled={disabled}
    >
      <legend>{label}</legend>
      {children}
    </fieldset>
  );
}
