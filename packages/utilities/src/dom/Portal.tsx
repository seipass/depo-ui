import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

export type PortalProps = {
  children: ReactNode;
  container?: Element | null;
  disabled?: boolean;
};

export function Portal({ children, container, disabled = false }: PortalProps) {
  if (disabled || typeof document === 'undefined') return <>{children}</>;
  return createPortal(children, container ?? document.body);
}
