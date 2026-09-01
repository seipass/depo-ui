import {
  useCallback,
  useEffect,
  useState,
  type FocusEventHandler,
  type KeyboardEvent,
  type KeyboardEventHandler,
} from 'react';

export type RovingItem = {
  id: string;
  disabled?: boolean;
};

export type RovingOrientation = 'horizontal' | 'vertical' | 'both';

export type RovingNavigationKey =
  'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'End' | 'Home';

export type RovingItemPropsOptions = {
  disabled?: boolean;
};

export type RovingItemProps = {
  tabIndex: 0 | -1;
  onFocus: FocusEventHandler<HTMLElement>;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
};

export type UseRovingTabIndexOptions = {
  items: readonly RovingItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  orientation?: RovingOrientation;
  loop?: boolean;
  /** Maps an item id to its focusable DOM id. Defaults to the item id. */
  getElementId?: (id: string) => string;
};

export type RovingTabIndexApi = {
  activeId: string | undefined;
  setActiveId: (id: string) => void;
  moveTo: (id: string) => void;
  getItemProps: (id: string, options?: RovingItemPropsOptions) => RovingItemProps;
};

function isEnabled(items: readonly RovingItem[], id: string) {
  return items.some((item) => item.id === id && !item.disabled);
}

function matchesOrientation(key: RovingNavigationKey, orientation: RovingOrientation) {
  if (orientation === 'both' || key === 'Home' || key === 'End') return true;
  const horizontal = key === 'ArrowLeft' || key === 'ArrowRight';
  return orientation === 'horizontal' ? horizontal : !horizontal;
}

/** Returns the next enabled id for a composite widget's roving focus model. */
export function getNextRovingId(
  items: readonly RovingItem[],
  currentId: string | undefined,
  key: RovingNavigationKey,
  orientation: RovingOrientation = 'both',
  loop = true,
) {
  if (!matchesOrientation(key, orientation)) return undefined;

  const enabled = items.filter((item) => !item.disabled);
  if (enabled.length === 0) return undefined;
  if (key === 'Home') return enabled[0]?.id;
  if (key === 'End') return enabled.at(-1)?.id;

  const currentIndex = enabled.findIndex((item) => item.id === currentId);
  const startIndex = currentIndex >= 0 ? currentIndex : 0;
  const direction = key === 'ArrowUp' || key === 'ArrowLeft' ? -1 : 1;
  const nextIndex = startIndex + direction;

  if (loop) return enabled[(nextIndex + enabled.length) % enabled.length]?.id;
  return enabled[Math.min(Math.max(nextIndex, 0), enabled.length - 1)]?.id;
}

export function getRovingTabIndex(activeId: string | undefined, id: string, disabled = false) {
  return !disabled && activeId === id ? (0 as const) : (-1 as const);
}

export function useRovingTabIndex({
  items,
  activeId: activeIdProp,
  defaultActiveId,
  onActiveIdChange,
  orientation = 'both',
  loop = true,
  getElementId = (id) => id,
}: UseRovingTabIndexOptions): RovingTabIndexApi {
  const firstEnabledId = items.find((item) => !item.disabled)?.id;
  const [uncontrolledActiveId, setUncontrolledActiveId] = useState(
    defaultActiveId && isEnabled(items, defaultActiveId) ? defaultActiveId : firstEnabledId,
  );
  const activeId = activeIdProp ?? uncontrolledActiveId;

  const setActiveId = useCallback(
    (id: string) => {
      if (!isEnabled(items, id)) return;
      if (activeIdProp === undefined) setUncontrolledActiveId(id);
      onActiveIdChange?.(id);
    },
    [activeIdProp, items, onActiveIdChange],
  );

  useEffect(() => {
    if (activeId && isEnabled(items, activeId)) return;
    if (firstEnabledId) setActiveId(firstEnabledId);
  }, [activeId, firstEnabledId, items, setActiveId]);

  const moveTo = useCallback(
    (id: string) => {
      if (!isEnabled(items, id)) return;
      setActiveId(id);
      if (typeof document !== 'undefined') {
        document.getElementById(getElementId(id))?.focus();
      }
    },
    [getElementId, items, setActiveId],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, id: string) => {
      const key = event.key as RovingNavigationKey;
      if (
        key !== 'ArrowDown' &&
        key !== 'ArrowLeft' &&
        key !== 'ArrowRight' &&
        key !== 'ArrowUp' &&
        key !== 'End' &&
        key !== 'Home'
      ) {
        return;
      }
      const nextId = getNextRovingId(items, id, key, orientation, loop);
      if (!nextId) return;
      event.preventDefault();
      moveTo(nextId);
    },
    [items, loop, moveTo, orientation],
  );

  const getItemProps = useCallback(
    (id: string, options: RovingItemPropsOptions = {}) => ({
      tabIndex: getRovingTabIndex(activeId, id, options.disabled),
      onFocus: () => {
        if (!options.disabled) setActiveId(id);
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => handleKeyDown(event, id),
    }),
    [activeId, handleKeyDown, setActiveId],
  );

  return { activeId, getItemProps, moveTo, setActiveId };
}
