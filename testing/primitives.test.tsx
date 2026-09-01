// @vitest-environment happy-dom

import { act, createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { useDescriptionIds } from '../packages/accessibility/src/index.ts';
import { CheckIcon } from '../packages/icons/src/index.ts';
import {
  Box,
  Divider,
  Heading,
  Icon,
  Stack,
  Text,
  VisuallyHidden,
} from '../packages/primitives/src/index.ts';

function DescriptionFixture() {
  const ids = useDescriptionIds({ hasDescription: true, hasError: true });
  return (
    <>
      <input aria-describedby={ids.describedBy} id={ids.id} />
      <p id={ids.descriptionId}>Help</p>
      <p id={ids.errorId}>Error</p>
    </>
  );
}

describe('Depo UI primitives', () => {
  it('preserves semantic HTML and exposes React 19 ref props where appropriate', () => {
    const buttonRef = createRef<HTMLButtonElement>();
    const markup = renderToStaticMarkup(
      <Stack as="ul" gap="sm">
        <Box as="button" ref={buttonRef} type="button">
          Action
        </Box>
        <Heading level={2}>Heading</Heading>
        <Text as="p" measure>
          Long text
        </Text>
      </Stack>,
    );

    expect(markup).toContain('<ul');
    expect(markup).toContain('<button');
    expect(markup).toContain('data-dui-stack');
    expect(markup).toContain('data-level="2"');
    expect(markup).toContain('data-measure="true"');
  });

  it('keeps accessibility helpers deterministic through SSR', () => {
    const markup = renderToStaticMarkup(<DescriptionFixture />);
    const describedBy = markup.match(/aria-describedby="([^"]+)"/)?.[1];

    expect(describedBy).toBeTruthy();
    expect(describedBy?.split(' ')).toHaveLength(2);
    expect(markup).toContain('aria-describedby=');
    expect(markup).toContain('id="dui-field-');
  });

  it('provides explicit semantics for icons, separators, and hidden content', () => {
    const markup = renderToStaticMarkup(
      <>
        <Icon label="Complete">
          <CheckIcon />
        </Icon>
        <Divider />
        <Divider orientation="vertical" />
        <VisuallyHidden focusable>Skip link</VisuallyHidden>
      </>,
    );

    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="Complete"');
    expect(markup).toContain('<hr');
    expect(markup).toContain('role="separator"');
    expect(markup).toContain('data-focusable="true"');
  });

  it('hydrates the server markup without replacing semantic nodes', async () => {
    const serverMarkup = renderToStaticMarkup(<Heading level={1}>Hydrated heading</Heading>);
    document.body.innerHTML = `<div id="root">${serverMarkup}</div>`;
    const root = document.querySelector('#root');
    expect(root).not.toBeNull();
    const serverNode = root?.firstElementChild;

    await act(async () => {
      hydrateRoot(root as HTMLElement, <Heading level={1}>Hydrated heading</Heading>);
    });

    expect(root?.querySelector('h1')?.textContent).toBe('Hydrated heading');
    expect(root?.firstElementChild).toBe(serverNode);
  });
});
