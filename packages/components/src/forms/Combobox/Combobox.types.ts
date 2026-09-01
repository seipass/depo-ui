import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
  keywords?: readonly string[];
  description?: ReactNode;
};

export type ComboboxValue = string | readonly string[];

export type ComboboxProps = Omit<
  ComponentPropsWithRef<'input'>,
  'children' | 'className' | 'defaultValue' | 'onChange' | 'value'
> & {
  options: readonly ComboboxOption[];
  value?: ComboboxValue;
  defaultValue?: ComboboxValue;
  onValueChange?: (value: ComboboxValue) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  placeholder?: string;
  allowCustomValue?: boolean;
  multiple?: boolean;
  loading?: boolean;
  invalid?: boolean;
  className?: string;
};
