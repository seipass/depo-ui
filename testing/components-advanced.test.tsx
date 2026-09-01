import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Combobox } from '../packages/components/src/forms/Combobox/index.ts';
import { DatePicker } from '../packages/components/src/forms/DatePicker/index.ts';
import { FileUpload } from '../packages/components/src/forms/FileUpload/index.ts';
import { Slider } from '../packages/components/src/forms/Slider/index.ts';
import { DataGrid } from '../packages/components/src/data-display/DataGrid/index.ts';
import { Tree } from '../packages/components/src/data-display/Tree/index.ts';
import { CommandPalette } from '../packages/components/src/navigation/CommandPalette/index.ts';
import { Drawer } from '../packages/components/src/overlays/Drawer/index.ts';

describe('Depo UI Phase 5 advanced components', () => {
  it('keeps advanced form controls on native or explicitly related semantics', () => {
    const markup = renderToStaticMarkup(
      <>
        <Combobox
          label="Assignee"
          options={[{ value: 'aiko', label: 'Aiko' }]}
          defaultInputValue="A"
        />
        <DatePicker label="Due date" />
        <FileUpload label="Attach files" />
        <Slider label="Priority" defaultValue={2} max={5} />
      </>,
    );
    expect(markup).toContain('role="combobox"');
    expect(markup).toContain('aria-haspopup="dialog"');
    expect(markup).toContain('type="file"');
    expect(markup).toContain('type="range"');
  });

  it('keeps data-heavy components explicit about their interaction model', () => {
    const markup = renderToStaticMarkup(
      <>
        <DataGrid
          columns={[
            { id: 'name', header: 'Name', sortable: true, editable: true },
            { id: 'owner', header: 'Owner' },
          ]}
          rows={[{ id: 'one', name: 'Project One', owner: 'Aiko' }]}
          selectable
        />
        <Tree
          defaultExpanded={['root']}
          nodes={[{ id: 'root', label: 'Root', children: [{ id: 'child', label: 'Child' }] }]}
        />
      </>,
    );
    expect(markup).toContain('role="grid"');
    expect(markup).toContain('aria-multiselectable="true"');
    expect(markup).toContain('role="tree"');
    expect(markup).toContain('aria-level="2"');
  });

  it('keeps command and drawer surfaces closed until an explicit open state', () => {
    const markup = renderToStaticMarkup(
      <>
        <CommandPalette commands={[{ id: 'help', label: 'Help' }]} />
        <Drawer title="Filters">Filter controls</Drawer>
      </>,
    );
    expect(markup).toContain('data-dui-command-palette');
    expect(markup).not.toContain('data-dui-drawer-root');
    expect(markup).not.toContain('role="dialog"');
  });
});
