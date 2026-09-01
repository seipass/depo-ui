import { useCallback, useEffect, useState, type FocusEvent } from 'react';

let hadKeyboardEvent = true;

const isKeyboardEvent = (event: KeyboardEvent) => !event.metaKey && !event.ctrlKey && !event.altKey;

export type FocusVisibleProps = {
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onBlur: () => void;
};

export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isKeyboardEvent(event)) hadKeyboardEvent = true;
    };
    const onPointerDown = () => {
      hadKeyboardEvent = false;
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, []);

  const onFocus = useCallback((event: FocusEvent<HTMLElement>) => {
    const nativeFocusVisible = event.currentTarget.matches(':focus-visible');
    setIsFocusVisible(nativeFocusVisible || hadKeyboardEvent);
  }, []);

  const onBlur = useCallback(() => {
    setIsFocusVisible(false);
  }, []);

  return {
    isFocusVisible,
    focusProps: { onFocus, onBlur } satisfies FocusVisibleProps,
  } as const;
}
