import { componentClassNames } from '../../shared/index.js';
import type { StatProps } from './Stat.types.js';
import { statClassName } from './Stat.styles.js';

export function Stat({ label, value, change, className, ...props }: StatProps) {
  return (
    <div {...props} className={componentClassNames(statClassName, className)} data-dui-stat="">
      <div className="dui-stat-label">{label}</div>
      <div className="dui-stat-value">{value}</div>
      {change !== undefined ? <div className="dui-stat-change">{change}</div> : null}
    </div>
  );
}
