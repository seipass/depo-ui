const globalLiveRegionSelector = '[data-dui-live-region="global"]';

function getGlobalLiveRegion() {
  if (typeof document === 'undefined') return undefined;
  const existing = document.querySelector<HTMLElement>(globalLiveRegionSelector);
  if (existing) return existing;

  const parent = document.body ?? document.documentElement;
  if (!parent) return undefined;
  const region = document.createElement('div');
  region.className = 'dui-visually-hidden';
  region.setAttribute('aria-atomic', 'true');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('data-dui-live-region', 'global');
  region.setAttribute('role', 'status');
  parent.append(region);
  return region;
}

/** Announces plain text through a shared, browser-only live region. */
export function announce(message: string, politeness: 'polite' | 'assertive' = 'polite') {
  const region = getGlobalLiveRegion();
  if (!region) return false;

  region.setAttribute('aria-live', politeness);
  region.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  region.textContent = '';
  region.textContent = message;
  return true;
}
