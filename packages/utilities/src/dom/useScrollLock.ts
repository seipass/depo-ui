import { useEffect } from 'react';

export function useScrollLock(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return undefined;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingInlineEnd = body.style.paddingInlineEnd;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingInlineEnd = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingInlineEnd = previousPaddingInlineEnd;
    };
  }, [enabled]);
}
