import { useEffect, useState } from 'react';

export const mediaQueries = {
  forcedColors: '(forced-colors: active)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const;

export function getMediaPreference(query: string, source?: Pick<Window, 'matchMedia'>) {
  const target = source ?? (typeof window === 'undefined' ? undefined : window);
  if (!target || typeof target.matchMedia !== 'function') return false;
  return target.matchMedia(query).matches;
}

export function useMediaPreference(query: string) {
  const [matches, setMatches] = useState(() => getMediaPreference(query));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;

    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);
    update();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, [query]);

  return matches;
}

export function useReducedMotion() {
  return useMediaPreference(mediaQueries.reducedMotion);
}

export function useForcedColors() {
  return useMediaPreference(mediaQueries.forcedColors);
}
