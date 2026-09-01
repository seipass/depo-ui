import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';

export const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true',
  );
}

export type FocusScopeProps = {
  children: ReactNode;
  contain?: boolean;
  restoreFocus?: boolean;
  autoFocus?: boolean;
};

export function FocusScope({
  children,
  contain = false,
  restoreFocus = true,
  autoFocus = false,
}: FocusScopeProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (autoFocus && scopeRef.current) {
      const firstFocusable =
        scopeRef.current.querySelector<HTMLElement>('[data-autofocus]') ??
        getFocusableElements(scopeRef.current)[0];
      firstFocusable?.focus();
    }

    return () => {
      if (restoreFocus && previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
    };
  }, [autoFocus, restoreFocus]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!contain || event.key !== 'Tab' || !scopeRef.current) return;
    const focusable = getFocusableElements(scopeRef.current);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && event.target === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && event.target === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div data-dui-focus-scope="" onKeyDown={handleKeyDown} ref={scopeRef}>
      {children}
    </div>
  );
}
