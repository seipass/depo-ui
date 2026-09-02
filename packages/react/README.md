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

React 19 is required. Apply `foundationAttributes({ theme, density, direction })` from `@depo-ui/react` to the application foundation element. Supported themes are `dark`, `light`, and `high-contrast`; supported densities are `compact`, `comfortable`, and `touch`.

The lower-level Depo UI packages are available for design-system integrations. Product applications should start with this package and its semantic token boundary.
