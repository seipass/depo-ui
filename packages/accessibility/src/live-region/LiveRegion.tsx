import { useCallback, useState, type HTMLAttributes, type ReactNode } from 'react';

export type LiveRegionProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'aria-atomic' | 'aria-live' | 'children' | 'role'
> & {
  message?: ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
};

export function LiveRegion({
  message,
  politeness = 'polite',
  atomic = true,
  className,
  ...props
}: LiveRegionProps) {
  const classes = ['dui-visually-hidden', className].filter(Boolean).join(' ') || undefined;
  const role =
    politeness === 'assertive' ? 'alert' : politeness === 'polite' ? 'status' : undefined;

  return (
    <div
      {...props}
      aria-atomic={atomic}
      aria-live={politeness}
      className={classes}
      data-dui-live-region=""
      role={role}
    >
      {message}
    </div>
  );
}

export function useLiveRegion() {
  const [message, setMessage] = useState<ReactNode>();
  const announce = useCallback((nextMessage: ReactNode) => setMessage(nextMessage), []);
  const clear = useCallback(() => setMessage(undefined), []);

  return { announce, clear, message } as const;
}
