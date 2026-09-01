import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type KeyboardEventHandler,
} from 'react';

export type TypeaheadMatch<T> = {
  item: T;
  index: number;
};

export type FindTypeaheadMatchOptions<T> = {
  isDisabled?: (item: T) => boolean;
  locale?: string;
};

export type UseTypeaheadOptions<T> = FindTypeaheadMatchOptions<T> & {
  items: readonly T[];
  getText: (item: T) => string;
  onMatch: (item: T, index: number) => void;
  activeIndex?: number;
  timeout?: number;
};

function normalize(value: string, locale?: string) {
  return value.trim().toLocaleLowerCase(locale);
}

export function isPrintableTypeaheadKey(
  event: Pick<KeyboardEvent, 'key' | 'altKey' | 'ctrlKey' | 'metaKey'>,
) {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
}

export function findTypeaheadMatch<T>(
  items: readonly T[],
  query: string,
  getText: (item: T) => string,
  startIndex = 0,
  { isDisabled = () => false, locale }: FindTypeaheadMatchOptions<T> = {},
): TypeaheadMatch<T> | undefined {
  const normalizedQuery = normalize(query, locale);
  if (!normalizedQuery || items.length === 0) return undefined;

  const normalizedStart = ((startIndex % items.length) + items.length) % items.length;
  for (let offset = 0; offset < items.length; offset += 1) {
    const index = (normalizedStart + offset) % items.length;
    const item = items[index];
    if (!item || isDisabled(item)) continue;
    if (normalize(getText(item), locale).startsWith(normalizedQuery)) return { index, item };
  }
  return undefined;
}

export function useTypeahead<T>({
  items,
  getText,
  onMatch,
  activeIndex = -1,
  timeout = 500,
  isDisabled,
  locale,
}: UseTypeaheadOptions<T>): { onKeyDown: KeyboardEventHandler<HTMLElement>; clear: () => void } {
  const bufferRef = useRef('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clear = useCallback(() => {
    bufferRef.current = '';
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLElement>>(
    (event) => {
      if (!isPrintableTypeaheadKey(event)) return;

      const startIndex = activeIndex + 1;
      const bufferedQuery = `${bufferRef.current}${event.key}`;
      let query = bufferedQuery;
      let match = findTypeaheadMatch(items, query, getText, startIndex, { isDisabled, locale });

      if (!match && bufferRef.current) {
        query = event.key;
        match = findTypeaheadMatch(items, query, getText, startIndex, { isDisabled, locale });
      }
      if (!match) return;

      event.preventDefault();
      bufferRef.current = query;
      onMatch(match.item, match.index);
      if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(clear, Math.max(0, timeout));
    },
    [activeIndex, clear, getText, isDisabled, items, locale, onMatch, timeout],
  );

  return { clear, onKeyDown };
}
