import { componentClassNames } from '../../shared/index.js';
import type { CheckboxGroupProps } from './CheckboxGroup.types.js';
import { checkboxGroupClassName } from './CheckboxGroup.styles.js';

export function CheckboxGroup({
  children,
  label,
  className,
  tone = 'primary',
  invalid = false,
  disabled = false,
  ...props
}: CheckboxGroupProps) {
  return (
    <fieldset
      {...props}
      className={componentClassNames(checkboxGroupClassName, className)}
      data-dui-checkbox-group=""
      data-invalid={invalid ? 'true' : undefined}
      data-tone={tone}
      disabled={disabled}
    >
      <legend>{label}</legend>
      {children}
    </fieldset>
  );
}
