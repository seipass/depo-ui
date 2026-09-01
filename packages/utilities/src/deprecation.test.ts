import { afterEach, describe, expect, it } from 'vitest';
import { formatDeprecationMessage, resetDeprecationWarnings, warnOnce } from './deprecation.js';

const notice = {
  id: 'button-kind-to-variant',
  name: 'Button kind',
  since: '0.2.0',
  removeAfter: '1.0.0',
  replacement: 'Button variant',
};

describe('Depo UI deprecation warnings', () => {
  afterEach(() => resetDeprecationWarnings());

  it('formats a replacement and warns only once', () => {
    const messages: string[] = [];
    expect(formatDeprecationMessage(notice)).toContain('Use Button variant instead.');
    expect(warnOnce(notice, (message) => messages.push(message))).toBe(true);
    expect(warnOnce(notice, (message) => messages.push(message))).toBe(false);
    expect(messages).toHaveLength(1);
  });
});
