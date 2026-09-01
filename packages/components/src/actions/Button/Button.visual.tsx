import { Button } from './Button.js';

export function ButtonVisualFixture() {
  return (
    <div data-visual-fixture="Button">
      <Button>Primary</Button>
      <Button variant="outline" tone="danger">
        Delete
      </Button>
      <Button loading>Saving</Button>
    </div>
  );
}
