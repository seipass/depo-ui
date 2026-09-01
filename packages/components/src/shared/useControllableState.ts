import { useCallback, useState } from 'react';

export function useControllableState<Value>({
  value,
  defaultValue,
  onChange,
}: {
  value?: Value;
  defaultValue: Value;
  onChange?: (value: Value) => void;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const resolvedValue = isControlled ? value : internalValue;
  const setValue = useCallback(
    (nextValue: Value) => {
      if (!isControlled) setInternalValue(nextValue);
      onChange?.(nextValue);
    },
    [isControlled, onChange],
  );

  return [resolvedValue as Value, setValue] as const;
}
