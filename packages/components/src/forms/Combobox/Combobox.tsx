import { useRef, useState, type KeyboardEvent } from 'react';
import { useStableId } from '@depo-ui/accessibility';
import { Popover } from '../../overlays/Popover/index.js';
import { componentClassNames, mergeRefs, useControllableState } from '../../shared/index.js';
import type { ComboboxOption, ComboboxProps, ComboboxValue } from './Combobox.types.js';
import { comboboxClassName } from './Combobox.styles.js';

function valuesOf(value: ComboboxValue | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? [...value] : [value];
}

export function Combobox({
  options,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  inputValue: inputValueProp,
  defaultInputValue = '',
  onInputValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label = 'Choose an option',
  placeholder = 'Search options',
  allowCustomValue = false,
  multiple = false,
  loading = false,
  invalid = false,
  className,
  disabled = false,
  ref,
  ...props
}: ComboboxProps) {
  const [value, setValue] = useControllableState<ComboboxValue>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [inputValue, setInputValue] = useControllableState({
    value: inputValueProp,
    defaultValue: defaultInputValue,
    onChange: onInputValueChange,
  });
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useStableId('dui-combobox');
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedValues = valuesOf(value);
  const normalizedQuery = inputValue.trim().toLocaleLowerCase();
  const filtered = options.filter((option) => {
    if (!normalizedQuery) return true;
    return [option.label, ...(option.keywords ?? [])]
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalizedQuery);
  });
  const enabled = filtered.filter((option) => !option.disabled);
  const activeOption = enabled[activeIndex % Math.max(enabled.length, 1)];

  const selectOption = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (multiple) {
      const next = selectedValues.includes(option.value)
        ? selectedValues.filter((selected) => selected !== option.value)
        : [...selectedValues, option.value];
      setValue(next);
      setInputValue('');
    } else {
      setValue(option.value);
      setInputValue(option.label);
      setOpen(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    props.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current + 1) % Math.max(enabled.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(
        (current) => (current - 1 + Math.max(enabled.length, 1)) % Math.max(enabled.length, 1),
      );
    } else if (event.key === 'Enter' && open && activeOption) {
      event.preventDefault();
      selectOption(activeOption);
    } else if (event.key === 'Enter' && open && allowCustomValue && inputValue) {
      event.preventDefault();
      setValue(multiple ? [...selectedValues, inputValue] : inputValue);
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <Popover
      aria-label={label}
      className="dui-combobox-listbox"
      id={listboxId}
      modal={false}
      onKeyDown={(event) => {
        if (event.key === 'Home') {
          event.preventDefault();
          setActiveIndex(0);
        } else if (event.key === 'End') {
          event.preventDefault();
          setActiveIndex(Math.max(enabled.length - 1, 0));
        }
      }}
      open={open}
      placement="bottom"
      role="listbox"
      trigger={
        <input
          {...props}
          aria-activedescendant={
            open && activeOption ? `${listboxId}-${activeOption.value}` : undefined
          }
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-invalid={invalid || undefined}
          aria-label={label}
          aria-multiselectable={multiple || undefined}
          className={componentClassNames(comboboxClassName, className)}
          data-dui-combobox=""
          data-dui-control=""
          data-invalid={invalid ? 'true' : undefined}
          disabled={disabled}
          onChange={(event) => {
            setInputValue(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onClick={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          ref={mergeRefs(inputRef, ref)}
          role="combobox"
          value={inputValue}
        />
      }
    >
      {loading ? (
        <div aria-live="polite" className="dui-combobox-status" role="status">
          Loading options…
        </div>
      ) : filtered.length ? (
        filtered.map((option) => {
          const selected = selectedValues.includes(option.value);
          const optionId = `${listboxId}-${option.value}`;
          return (
            <div
              aria-disabled={option.disabled || undefined}
              aria-selected={selected}
              className="dui-combobox-option"
              data-disabled={option.disabled ? 'true' : undefined}
              data-dui-combobox-option=""
              id={optionId}
              key={option.value}
              onClick={() => selectOption(option)}
              role="option"
              tabIndex={-1}
            >
              <span>{option.label}</span>
              {option.description ? <small>{option.description}</small> : null}
            </div>
          );
        })
      ) : (
        <div aria-live="polite" className="dui-combobox-status" role="status">
          {allowCustomValue ? 'Press Enter to use this value.' : 'No results.'}
        </div>
      )}
    </Popover>
  );
}
