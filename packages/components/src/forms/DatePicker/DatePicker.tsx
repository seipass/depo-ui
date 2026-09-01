import { useRef } from 'react';
import { useStableId } from '@depo-ui/accessibility';
import { Popover } from '../../overlays/Popover/index.js';
import { componentClassNames, mergeRefs, useControllableState } from '../../shared/index.js';
import type { DatePickerProps } from './DatePicker.types.js';
import { datePickerClassName } from './DatePicker.styles.js';

function formatDate(value: string, locale: string | undefined) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(date);
}

export function DatePicker({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  label = 'Date',
  placeholder = 'Choose a date',
  locale,
  min,
  max,
  invalid = false,
  disabled = false,
  className,
  ref,
  ...props
}: DatePickerProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarId = useStableId('dui-date-picker');
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Popover
      aria-label={`${label} calendar`}
      className="dui-date-picker-calendar"
      id={calendarId}
      modal
      placement="bottom"
      trigger={
        <button
          {...props}
          aria-controls={calendarId}
          aria-haspopup="dialog"
          aria-invalid={invalid || undefined}
          aria-label={label}
          className={componentClassNames(datePickerClassName, className)}
          data-dui-control=""
          data-dui-date-picker=""
          data-invalid={invalid ? 'true' : undefined}
          disabled={disabled}
          ref={mergeRefs(triggerRef, ref)}
          type="button"
        >
          {value ? formatDate(value, locale) : placeholder}
        </button>
      }
    >
      <div aria-label={`${label} calendar`} className="dui-date-picker-content" role="dialog">
        <div className="dui-date-picker-header">
          <strong>{value ? formatDate(value, locale) : label}</strong>
          <button
            disabled={(min !== undefined && today < min) || (max !== undefined && today > max)}
            onClick={() => {
              setValue(today);
              triggerRef.current?.focus();
            }}
            type="button"
          >
            Today
          </button>
        </div>
        <label className="dui-date-picker-input-label" htmlFor={`${calendarId}-input`}>
          Choose date
        </label>
        <input
          aria-label={`Choose ${label}`}
          id={`${calendarId}-input`}
          max={max}
          min={min}
          onChange={(event) => {
            setValue(event.target.value);
            triggerRef.current?.focus();
          }}
          type="date"
          value={value}
        />
      </div>
    </Popover>
  );
}
