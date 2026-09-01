import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SegmentedControl } from './SegmentedControl.js';

describe('SegmentedControl accessibility', () => {
  it('provides a group label and disabled state', () => {
    const markup = renderToStaticMarkup(
      <SegmentedControl
        ariaLabel="View"
        options={[{ value: 'list', label: 'List', disabled: true }]}
      />,
    );
    expect(markup).toContain('aria-label="View"');
    expect(markup).toContain('disabled=""');
  });
});
