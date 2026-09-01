import { useStableId } from '@depo-ui/accessibility';
import { componentClassNames, useControllableState } from '../../shared/index.js';
import type { DisclosureProps } from './Disclosure.types.js';
import { disclosureClassName } from './Disclosure.styles.js';

export function Disclosure({
  title,
  children,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  disabled = false,
  className,
  ref,
  ...props
}: DisclosureProps) {
  const [expanded, setExpanded] = useControllableState({
    value: expandedProp,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });
  const disclosureId = useStableId('dui-disclosure');
  const triggerId = `${disclosureId}-trigger`;
  const contentId = `${disclosureId}-content`;
  return (
    <div
      {...props}
      className={componentClassNames(disclosureClassName, className)}
      data-dui-disclosure=""
      data-expanded={expanded ? 'true' : undefined}
      ref={ref}
    >
      <h3>
        <button
          aria-controls={contentId}
          aria-expanded={expanded}
          disabled={disabled}
          id={triggerId}
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          {title}
        </button>
      </h3>
      <div
        aria-labelledby={triggerId}
        hidden={!expanded}
        id={contentId}
        role="region"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
