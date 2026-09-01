import { useRef, type KeyboardEvent } from 'react';
import { useStableId } from '@depo-ui/accessibility';
import { Popover } from '../../overlays/Popover/index.js';
import { componentClassNames, mergeRefs, useControllableState } from '../../shared/index.js';
import type { SelectOption, SelectProps } from './Select.types.js';
import { selectClassName } from './Select.styles.js';

export function Select({
  options,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  placeholder = 'Select an option',
  label = 'Select',
  invalid = false,
  size = 'md',
  className,
  disabled = false,
  ref,
  ...props
}: SelectProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((option) => option.value === value);
  const listboxId = useStableId('dui-select');

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return;
    }
    event.preventDefault();
    const enabled = options.filter((option) => !option.disabled);
    const current = Math.max(
      0,
      enabled.findIndex((option) => option.value === value),
    );
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? enabled.length - 1
          : (current + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length;
    const next = enabled[nextIndex];
    if (next) setValue(next.value);
  };

  const selectOption = (option: SelectOption) => {
    if (option.disabled) return;
    setValue(option.value);
    triggerRef.current?.focus();
  };

  return (
    <Popover
      aria-label={label}
      className="dui-select-listbox"
      id={listboxId}
      modal
      onKeyDown={handleKeyDown}
      placement="bottom"
      role="listbox"
      tabIndex={-1}
      trigger={
        <button
          {...props}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-invalid={invalid || undefined}
          aria-label={label}
          className={componentClassNames(selectClassName, className)}
          data-dui-control=""
          data-dui-select=""
          data-invalid={invalid ? 'true' : undefined}
          data-size={size}
          disabled={disabled}
          ref={mergeRefs(triggerRef, ref)}
          type="button"
        >
          <span>{selected?.label ?? placeholder}</span>
          <span aria-hidden="true">⌄</span>
        </button>
      }
    >
      <>
        {options.map((option) => (
          <div
            aria-disabled={option.disabled || undefined}
            aria-selected={option.value === value}
            className="dui-select-option"
            data-disabled={option.disabled ? 'true' : undefined}
            data-dui-select-option=""
            key={option.value}
            onClick={() => selectOption(option)}
            role="option"
            tabIndex={option.value === value ? 0 : -1}
          >
            {option.label}
          </div>
        ))}
      </>
    </Popover>
  );
}
