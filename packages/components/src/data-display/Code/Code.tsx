import { componentClassNames } from '../../shared/index.js';
import type { CodeProps } from './Code.types.js';
import { codeClassName } from './Code.styles.js';

export function Code({ children, className, block = false, ...props }: CodeProps) {
  return (
    <code
      {...props}
      className={componentClassNames(codeClassName, className)}
      data-block={block ? 'true' : undefined}
      data-dui-code=""
    >
      {children}
    </code>
  );
}
