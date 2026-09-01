import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Portal } from '@depo-ui/utilities';
import { Button } from '../../actions/Button/index.js';
import { componentClassNames } from '../../shared/index.js';
import type { ToastAction, ToastOptions, ToastProps } from './Toast.types.js';
import { toastClassName } from './Toast.styles.js';

type ToastContextValue = {
  addToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function createToastId() {
  return `dui-toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function Toast({
  title,
  description,
  tone = 'neutral',
  duration = 5000,
  action,
  open = true,
  onClose,
  closeLabel = 'Dismiss notification',
  className,
  ...props
}: ToastProps) {
  useEffect(() => {
    if (!open || !duration || !onClose) return;
    const timeout = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timeout);
  }, [duration, onClose, open]);

  if (!open) return null;
  return (
    <div
      {...props}
      aria-atomic="true"
      className={componentClassNames(toastClassName, className)}
      data-dui-toast=""
      data-tone={tone}
      role={tone === 'danger' ? 'alert' : 'status'}
    >
      <div className="dui-toast-content">
        <strong>{title}</strong>
        {description ? <span>{description}</span> : null}
      </div>
      {action ? (
        <Button onClick={action.onClick} size="sm" variant="ghost">
          {action.label}
        </Button>
      ) : null}
      {onClose ? (
        <Button aria-label={closeLabel} onClick={onClose} size="sm" variant="ghost">
          ×
        </Button>
      ) : null}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Array<ToastOptions & { id: string }>>([]);
  const dismissToast = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);
  const addToast = useCallback((options: ToastOptions) => {
    const id = createToastId();
    setItems((current) => [...current, { ...options, id }]);
    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, dismissToast }}>
      {children}
      <Portal>
        <aside aria-label="Notifications" className="dui-toast-viewport" data-dui-toast-viewport="">
          {items.map(({ id, ...options }) => (
            <Toast key={id} {...options} onClose={() => dismissToast(id)} />
          ))}
        </aside>
      </Portal>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider.');
  return context;
}

export type { ToastAction };
