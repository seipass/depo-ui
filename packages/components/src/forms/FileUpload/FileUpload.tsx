import { useState, type ChangeEvent, type DragEvent } from 'react';
import { componentClassNames } from '../../shared/index.js';
import type { FileUploadProps } from './FileUpload.types.js';
import { fileUploadClassName } from './FileUpload.styles.js';

export function FileUpload({
  label,
  hint,
  accept,
  multiple = false,
  onFilesChange,
  errorMessage,
  progress,
  loading = false,
  className,
  disabled = false,
  ref,
  ...props
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<readonly File[]>([]);
  const handleFiles = (nextFiles: FileList | readonly File[]) => {
    const next = Array.from(nextFiles).slice(0, multiple ? undefined : 1);
    setFiles(next);
    onFilesChange?.(next);
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    handleFiles(event.target.files ?? []);
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled && !loading) handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      className={componentClassNames(fileUploadClassName, className)}
      data-dragging={dragging ? 'true' : undefined}
      data-dui-file-upload=""
      data-loading={loading ? 'true' : undefined}
    >
      <label
        className="dui-file-upload-dropzone"
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled && !loading) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <span className="dui-file-upload-label">{label}</span>
        {hint ? <span className="dui-file-upload-hint">{hint}</span> : null}
        <input
          {...props}
          accept={accept}
          aria-busy={loading || undefined}
          aria-invalid={errorMessage ? true : undefined}
          disabled={disabled || loading}
          multiple={multiple}
          onChange={handleChange}
          ref={ref}
          type="file"
        />
      </label>
      {files.length ? (
        <ul aria-label="Selected files" className="dui-file-upload-files">
          {files.map((file) => (
            <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
          ))}
        </ul>
      ) : null}
      {progress !== undefined ? (
        <div
          aria-label="Upload progress"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="dui-file-upload-progress"
          role="progressbar"
        >
          <span style={{ inlineSize: `${Math.max(0, Math.min(progress, 100))}%` }} />
        </div>
      ) : null}
      {errorMessage ? (
        <div aria-live="polite" className="dui-file-upload-error" role="alert">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
