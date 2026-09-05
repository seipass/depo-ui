# @depo-ui/react

The product-facing React entrypoint for Depo UI.

## Install

```bash
pnpm add @depo-ui/react
```

## Usage

```tsx
import '@depo-ui/react/css';

import { Button, Card, Field, TextInput } from '@depo-ui/react';

export function App() {
  return (
    <Card>
      <Field label="Project name" required>
        <TextInput name="projectName" />
      </Field>
      <Button type="submit">Create project</Button>
    </Card>
  );
}
```

React 19 is required. Depo UI uses a dark appearance by default; no theme provider or theme attribute is required. Apply `foundationAttributes({ density, direction })` from `@depo-ui/react` only when the application needs subtree density or direction. Supported densities are `compact`, `comfortable`, and `touch`. OS-level forced-colors / Windows High Contrast remains supported for accessibility.

The lower-level Depo UI packages are available for design-system integrations. Product applications should start with this package and its semantic token boundary.
