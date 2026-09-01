import { useEffect, type RefObject } from 'react';

type InertElement = HTMLElement & { inert: boolean };

export function useInertSiblings(containerRef: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    const container = containerRef.current;
    const parent = container?.parentElement;
    if (!enabled || !container || !parent) return undefined;

    const siblings = Array.from(parent.children).filter(
      (element): element is InertElement => element !== container && element instanceof HTMLElement,
    );
    const previous = siblings.map((sibling) => ({
      element: sibling,
      inert: sibling.inert,
      ariaHidden: sibling.getAttribute('aria-hidden'),
    }));
    siblings.forEach((sibling) => {
      sibling.inert = true;
      sibling.setAttribute('aria-hidden', 'true');
    });

    return () => {
      previous.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
    };
  }, [containerRef, enabled]);
}
