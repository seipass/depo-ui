import { componentClassNames } from '../../shared/index.js';
import type { KeyValueProps } from './KeyValue.types.js';
import { keyValueClassName } from './KeyValue.styles.js';

export function KeyValue({ items, className, ...props }: KeyValueProps) {
  return (
    <dl
      {...props}
      className={componentClassNames(keyValueClassName, className)}
      data-dui-key-value=""
    >
      {items.map((item, index) => (
        <div className="dui-key-value-row" key={index}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
