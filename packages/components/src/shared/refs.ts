import type { Ref } from 'react';

export function mergeRefs<Value>(...refs: Array<Ref<Value> | undefined>) {
  return (value: Value | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        ref.current = value;
      }
    }
  };
}
