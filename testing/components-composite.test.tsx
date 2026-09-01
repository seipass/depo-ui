import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Accordion,
  Breadcrumbs,
  Disclosure,
  Menu,
  MenuButton,
  Pagination,
  SegmentedControl,
  Select,
  SideNav,
  SplitButton,
  Tabs,
  Toast,
  ToggleButton,
  TopNav,
} from '../packages/components/src/index.ts';
import { Button } from '../packages/components/src/actions/Button/index.ts';

describe('Depo UI Phase 4C composite components', () => {
  it('separates actions, value selection, and action menus by semantic contract', () => {
    const markup = renderToStaticMarkup(
      <>
        <SplitButton
          items={[{ id: 'archive', label: 'Archive', onSelect: () => undefined }]}
          label="Save"
        />
        <Select
          aria-label="Plan"
          options={[
            { value: 'basic', label: 'Basic' },
            { value: 'pro', label: 'Pro' },
          ]}
        />
        <Menu
          defaultOpen
          items={[{ id: 'rename', label: 'Rename' }]}
          trigger={<Button>Actions</Button>}
        />
        <MenuButton items={[{ id: 'help', label: 'Help' }]} label="More" />
      </>,
    );

    expect(markup).toContain('data-dui-split-button');
    expect(markup).toContain('data-dui-select');
    expect(markup).toContain('role="menu"');
    expect(markup).toContain('role="menuitem"');
    expect(markup).toContain('aria-haspopup="menu"');
  });

  it('keeps selection state and keyboard-oriented roles explicit', () => {
    const markup = renderToStaticMarkup(
      <>
        <Tabs
          defaultValue="overview"
          items={[
            { id: 'overview', label: 'Overview', content: 'Summary' },
            { id: 'activity', label: 'Activity', content: 'Events' },
          ]}
        />
        <SegmentedControl
          ariaLabel="View"
          defaultValue="list"
          options={[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid' },
          ]}
        />
        <ToggleButton defaultPressed>Pin</ToggleButton>
      </>,
    );

    expect(markup).toContain('role="tablist"');
    expect(markup).toContain('role="tabpanel"');
    expect(markup).toContain('role="radio"');
    expect(markup).toContain('aria-pressed="true"');
  });

  it('uses landmark and list semantics for navigation', () => {
    const items = [
      { id: 'home', href: '/', label: 'Home' },
      { id: 'current', href: '/accounts', label: 'Accounts', current: true },
    ];
    const markup = renderToStaticMarkup(
      <>
        <Breadcrumbs items={items} />
        <Pagination onPageChange={() => undefined} page={2} pageCount={5} />
        <SideNav items={items} />
        <TopNav brand="Depo UI" items={items} />
      </>,
    );

    expect(markup).toContain('aria-label="Breadcrumb"');
    expect(markup).toContain('aria-label="Pagination"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain('data-dui-top-nav');
  });

  it('keeps disclosure regions associated with their headings', () => {
    const markup = renderToStaticMarkup(
      <>
        <Disclosure defaultExpanded title="Details">
          Account information
        </Disclosure>
        <Accordion
          defaultValue={['one']}
          items={[
            { id: 'one', title: 'One', content: 'First' },
            { id: 'two', title: 'Two', content: 'Second' },
          ]}
        />
      </>,
    );

    expect(markup).toContain('aria-expanded="true"');
    expect(markup).toContain('role="region"');
    expect(markup).toContain('data-dui-accordion');
  });

  it('announces transient feedback without moving focus', () => {
    const markup = renderToStaticMarkup(
      <Toast action={{ label: 'Undo', onClick: () => undefined }} title="Saved" tone="success" />,
    );
    expect(markup).toContain('role="status"');
    expect(markup).toContain('Undo');
    expect(markup).toContain('data-tone="success"');
  });
});
