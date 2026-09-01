import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SegmentedControl } from './SegmentedControl.js';

describe('SegmentedControl', () => {
  it('renders a selected option as a radio group', () => {
    const markup = renderToStaticMarkup(
      <SegmentedControl
        options={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
        ]}
      />,
    );
    expect(markup).toContain('role="group"');
    expect(markup).toContain('role="radio"');
    expect(markup).toContain('aria-checked="true"');
  });
});
