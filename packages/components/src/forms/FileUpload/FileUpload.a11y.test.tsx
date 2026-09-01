import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FileUpload } from './FileUpload.js';

describe('FileUpload accessibility', () => {
  it('announces loading and error states while retaining the file control', () => {
    const markup = renderToStaticMarkup(
      <FileUpload errorMessage="Choose a smaller file." label="Upload" loading />,
    );
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('role="alert"');
    expect(markup).toContain('Choose a smaller file.');
  });
});
