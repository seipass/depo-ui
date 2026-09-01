import { componentClassNames } from '../../shared/index.js';
import type { InlineMessageProps } from './InlineMessage.types.js';
import { inlineMessageClassName } from './InlineMessage.styles.js';

export function InlineMessage({
  children,
  className,
  title,
  tone = 'neutral',
  ...props
}: InlineMessageProps) {
  const role = tone === 'danger' || tone === 'warning' ? 'alert' : 'status';
  return (
    <div
      {...props}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      className={componentClassNames(inlineMessageClassName, className)}
      data-dui-inline-message=""
      data-tone={tone}
      role={role}
    >
      {title ? <div className="dui-message-title">{title}</div> : null}
      <div>{children}</div>
    </div>
  );
}
