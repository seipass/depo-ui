import { useEffect, type RefObject } from 'react';

export function useInitialFocus(targetRef: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    targetRef.current?.focus();
  }, [enabled, targetRef]);
}
