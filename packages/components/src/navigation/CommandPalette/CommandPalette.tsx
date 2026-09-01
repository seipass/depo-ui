import { useEffect, useMemo, useRef, useState } from 'react';
import { useStableId } from '@depo-ui/accessibility';
import { Dialog } from '../../overlays/Dialog/index.js';
import { componentClassNames, useControllableState } from '../../shared/index.js';
import type { Command, CommandPaletteProps } from './CommandPalette.types.js';
import { commandPaletteClassName } from './CommandPalette.styles.js';

export function CommandPalette({
  commands,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label = 'Command palette',
  shortcut = 'mod+k',
  className,
  ...props
}: CommandPaletteProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useStableId('dui-command-palette-listbox');
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered = useMemo(
    () =>
      commands.filter((command) =>
        [command.label, ...(command.keywords ?? [])]
          .join(' ')
          .toLocaleLowerCase()
          .includes(normalizedQuery),
      ),
    [commands, normalizedQuery],
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const isModifier = event.ctrlKey || event.metaKey;
      if (isModifier && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const selectCommand = (command: Command) => {
    if (command.disabled) return;
    command.onSelect?.();
    setOpen(false);
    setQuery('');
  };
  const activeCommand = filtered[activeIndex % Math.max(filtered.length, 1)];

  return (
    <div
      {...props}
      className={componentClassNames(commandPaletteClassName, className)}
      data-dui-command-palette=""
    >
      <span className="dui-command-palette-shortcut">{shortcut}</span>
      <Dialog open={open} onOpenChange={setOpen} title={label}>
        <div className="dui-command-palette-content">
          <input
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={open}
            aria-label="Search commands"
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActiveIndex((current) => (current + 1) % Math.max(filtered.length, 1));
              } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveIndex(
                  (current) =>
                    (current - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1),
                );
              } else if (event.key === 'Enter' && activeCommand) {
                event.preventDefault();
                selectCommand(activeCommand);
              }
            }}
            placeholder="Search commands"
            ref={inputRef}
            role="combobox"
            value={query}
          />
          <div aria-label="Command results" id={listboxId} role="listbox">
            {filtered.length ? (
              filtered.map((command, index) => (
                <button
                  aria-disabled={command.disabled || undefined}
                  aria-selected={index === activeIndex}
                  className="dui-command-palette-item"
                  disabled={command.disabled}
                  key={command.id}
                  onClick={() => selectCommand(command)}
                  role="option"
                  type="button"
                >
                  <span>{command.label}</span>
                  {command.description ? <small>{command.description}</small> : null}
                </button>
              ))
            ) : (
              <div aria-live="polite" role="status">
                No commands found.
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
