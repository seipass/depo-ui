// @vitest-environment happy-dom

import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Avatar,
  Badge,
  Banner,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Code,
  EmptyState,
  ErrorState,
  Field,
  InlineMessage,
  Kbd,
  KeyValue,
  Link,
  List,
  NumberInput,
  ProgressBar,
  Radio,
  RadioGroup,
  SearchField,
  Skeleton,
  Spinner,
  Stat,
  Switch,
  Table,
  Tag,
  Textarea,
  TextInput,
} from '../packages/components/src/index.ts';

describe('Depo UI Phase 4A basic controls', () => {
  it('keeps native action and form semantics while exposing a React 19 ref prop', () => {
    const buttonRef = createRef<HTMLButtonElement>();
    const inputRef = createRef<HTMLInputElement>();
    const markup = renderToStaticMarkup(
      <form>
        <Button ref={buttonRef} loading type="submit">
          Save
        </Button>
        <Field description="Use your work email" label="Email" required>
          <TextInput ref={inputRef} name="email" type="email" />
        </Field>
        <Textarea aria-label="Notes" />
        <NumberInput aria-label="Quantity" min={1} />
        <SearchField aria-label="Search" />
      </form>,
    );

    expect(markup).toContain('<form>');
    expect(markup).toContain('type="submit"');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('aria-describedby="dui-field-');
    expect(markup).toContain('aria-required="true"');
    expect(markup).toContain('type="email"');
    expect(buttonRef).toBeDefined();
    expect(inputRef).toBeDefined();
  });

  it('uses native choice semantics and group landmarks', () => {
    const markup = renderToStaticMarkup(
      <>
        <CheckboxGroup label="Notifications">
          <Checkbox name="email">Email</Checkbox>
          <Checkbox name="push">Push</Checkbox>
        </CheckboxGroup>
        <RadioGroup label="Plan">
          <Radio name="plan" value="basic">
            Basic
          </Radio>
        </RadioGroup>
        <Switch>Automatic updates</Switch>
      </>,
    );

    expect(markup).toContain('<fieldset');
    expect(markup).toContain('<legend>Notifications</legend>');
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('role="switch"');
    expect(markup).toContain('<legend>Plan</legend>');
    expect(markup).toContain('type="radio"');
  });

  it('renders data display with readable structure', () => {
    const markup = renderToStaticMarkup(
      <>
        <Badge tone="success">Active</Badge>
        <Tag removable>Owner</Tag>
        <Avatar initials="DU" label="Depo UI" />
        <Card>Panel</Card>
        <List>
          <li>One</li>
        </List>
        <Table caption="Accounts" headers={['Name', 'Status']} rows={[['A', 'Active']]} />
        <Stat label="Users" value="42" />
        <KeyValue items={[{ label: 'Region', value: 'Japan' }]} />
        <Code>pnpm test</Code>
        <Kbd>⌘K</Kbd>
      </>,
    );

    expect(markup).toContain('data-dui-badge');
    expect(markup).toContain('aria-label="Depo UI"');
    expect(markup).toContain('<table');
    expect(markup).toContain('<caption>Accounts</caption>');
    expect(markup).toContain('<th scope="col">Name</th>');
    expect(markup).toContain('<dt>Region</dt>');
    expect(markup).toContain('<code');
    expect(markup).toContain('<kbd');
  });

  it('provides explicit feedback, loading, and recovery surfaces', () => {
    const markup = renderToStaticMarkup(
      <>
        <InlineMessage title="Saved" tone="success">
          Your changes are live.
        </InlineMessage>
        <Banner title="Attention" tone="warning">
          Review the highlighted fields.
        </Banner>
        <Spinner label="Saving" />
        <ProgressBar label="Upload" value={65} />
        <Skeleton />
        <EmptyState action={<Button>Create</Button>} title="No projects">
          Create your first project.
        </EmptyState>
        <ErrorState action={<Link href="/retry">Try again</Link>} title="Could not load">
          Check your connection.
        </ErrorState>
      </>,
    );

    expect(markup).toContain('role="status"');
    expect(markup).toContain('role="alert"');
    expect(markup).toContain('aria-label="Saving"');
    expect(markup).toContain('aria-valuenow="65"');
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('data-dui-error-state');
  });
});
