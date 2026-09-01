import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FileUpload } from './FileUpload.js';

describe('FileUpload', () => {
  it('renders a native file input and progress feedback', () => {
    const markup = renderToStaticMarkup(
      <FileUpload label="Attach files" hint="PNG or PDF" progress={45} accept=".png,.pdf" />,
    );
    expect(markup).toContain('type="file"');
    expect(markup).toContain('accept=".png,.pdf"');
    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-valuenow="45"');
  });
});
