import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  DataManagement,
  ErrorRecovery,
  FormSubmission,
  ListDetail,
  ResponsiveNavigation,
  SearchFilter,
  patternDefinitions,
} from '../packages/patterns/src/index.ts';

const navigationItems = [
  { id: 'overview', href: '/overview', label: 'Overview', current: true },
  { id: 'settings', href: '/settings', label: 'Settings' },
];

describe('Depo UI Phase 6 patterns', () => {
  it('provides a recoverable form submission composition', () => {
    const markup = renderToStaticMarkup(
      <FormSubmission errorMessage="Enter a valid email address." status="error">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </FormSubmission>,
    );
    expect(markup).toContain('data-dui-pattern="form-submission"');
    expect(markup).toContain('aria-describedby=');
    expect(markup).toContain('Could not save');
    expect(markup).toContain('Enter a valid email address.');
  });

  it('keeps search/filter, list/detail, and data management states explicit', () => {
    const markup = renderToStaticMarkup(
      <>
        <SearchFilter
          filters={[{ id: 'status', label: 'Status: active' }]}
          onClearFilters={() => undefined}
          resultCount={12}
          status="results"
        >
          <p>Results</p>
        </SearchFilter>
        <ListDetail
          defaultSelectedId="one"
          detail={<p>Project details</p>}
          items={[{ id: 'one', label: 'Project One' }]}
        />
        <DataManagement
          columns={[{ id: 'name', header: 'Name' }]}
          rows={[{ id: 'one', name: 'Project One' }]}
        />
      </>,
    );
    expect(markup).toContain('data-dui-pattern="search-filter"');
    expect(markup).toContain('Active filters');
    expect(markup).toContain('data-dui-pattern="list-detail"');
    expect(markup).toContain('data-dui-pattern="data-management"');
    expect(markup).toContain('role="grid"');
  });

  it('keeps recovery and responsive navigation domain-agnostic', () => {
    const markup = renderToStaticMarkup(
      <>
        <ErrorRecovery
          alternative="Contact support"
          message="The records could not be loaded."
          onRetry={() => undefined}
          title="Records unavailable"
        />
        <ResponsiveNavigation brand="Depo UI" items={navigationItems}>
          <h1>Overview</h1>
        </ResponsiveNavigation>
      </>,
    );
    expect(markup).toContain('data-dui-pattern="error-recovery"');
    expect(markup).toContain('Retry');
    expect(markup).toContain('data-dui-pattern="responsive-navigation"');
    expect(markup).toContain('Primary navigation');
  });

  it('keeps the complete catalog machine-readable and lifecycle-marked', () => {
    expect(patternDefinitions).toHaveLength(19);
    expect(patternDefinitions.every((pattern) => pattern.lifecycle === 'trial')).toBe(true);
    expect(patternDefinitions.map((pattern) => pattern.id)).toContain('command-palette');
  });
});
