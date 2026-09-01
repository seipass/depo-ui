import { componentClassNames } from '../../shared/index.js';
import { FieldControl, fieldMessageClassName, useFieldDescription } from '../../shared/field.js';
import type { FieldProps } from './Field.types.js';
import { fieldClassName } from './Field.styles.js';

export function Field({
  id,
  label,
  description,
  errorMessage,
  invalid = false,
  required = false,
  children,
  className,
  ...props
}: FieldProps) {
  const ids = useFieldDescription({ id, description, errorMessage });
  const isInvalid = invalid || Boolean(errorMessage);

  return (
    <div
      {...props}
      className={componentClassNames(fieldClassName, className)}
      data-dui-field=""
      data-invalid={isInvalid ? 'true' : undefined}
    >
      <label className="dui-field-label" htmlFor={ids.id}>
        {label}
        {required ? <span className="dui-field-required"> *</span> : null}
      </label>
      <div data-dui-field-control="">
        <FieldControl
          describedBy={ids.describedBy}
          id={ids.id}
          invalid={isInvalid}
          required={required}
        >
          {children}
        </FieldControl>
      </div>
      {description ? (
        <div className={fieldMessageClassName('description')} id={ids.descriptionId}>
          {description}
        </div>
      ) : null}
      {errorMessage ? (
        <div
          aria-live="polite"
          className={fieldMessageClassName('error')}
          id={ids.errorId}
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
