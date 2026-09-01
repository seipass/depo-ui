import { useEffect, useRef, type ReactNode } from 'react';

type DismissableLayerEntry = {
  element: HTMLElement;
  onDismiss: () => void;
  escapeKeyDown: boolean;
};

const layerStack: DismissableLayerEntry[] = [];

export type DismissableLayerProps = {
  children: ReactNode;
  onDismiss: () => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  escapeKeyDown?: boolean;
};

export function DismissableLayer({
  children,
  onDismiss,
  onPointerDownOutside,
  escapeKeyDown = true,
}: DismissableLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = layerRef.current;
    if (!element) return undefined;
    const entry = { element, onDismiss, escapeKeyDown };
    layerStack.push(entry);

    const onPointerDown = (event: PointerEvent) => {
      if (layerStack[layerStack.length - 1] !== entry) return;
      if (event.composedPath().includes(element)) return;
      onPointerDownOutside?.(event);
      if (!event.defaultPrevented) onDismiss();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || layerStack[layerStack.length - 1] !== entry || !escapeKeyDown)
        return;
      event.preventDefault();
      onDismiss();
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
      const index = layerStack.indexOf(entry);
      if (index >= 0) layerStack.splice(index, 1);
    };
  }, [escapeKeyDown, onDismiss, onPointerDownOutside]);

  return (
    <div data-dui-dismissable-layer="" ref={layerRef}>
      {children}
    </div>
  );
}

export function getDismissableLayerDepth() {
  return layerStack.length;
}
