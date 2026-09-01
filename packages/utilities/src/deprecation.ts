export type DeprecationNotice = {
  id: string;
  name: string;
  since: string;
  removeAfter: string;
  replacement?: string;
};

type RuntimeWithProcess = typeof globalThis & {
  process?: { env?: { NODE_ENV?: string } };
};

const warned = new Set<string>();

const isProduction = () =>
  (globalThis as RuntimeWithProcess).process?.env?.NODE_ENV === 'production';

export const formatDeprecationMessage = (notice: DeprecationNotice) => {
  const replacement = notice.replacement ? ` Use ${notice.replacement} instead.` : '';
  return `[Depo UI] ${notice.name} is deprecated since ${notice.since} and will be removed after ${notice.removeAfter}.${replacement}`;
};

export const warnOnce = (
  notice: DeprecationNotice,
  logger: (message: string) => void = (message) => console.warn(message),
) => {
  if (isProduction() || warned.has(notice.id)) return false;
  warned.add(notice.id);
  logger(formatDeprecationMessage(notice));
  return true;
};

export const resetDeprecationWarnings = () => {
  warned.clear();
};
