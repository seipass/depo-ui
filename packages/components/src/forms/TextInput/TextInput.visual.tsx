import { TextInput } from './TextInput.js';

export function TextInputVisualFixture() {
  return (
    <div data-visual-fixture="TextInput">
      <TextInput aria-label="Default" placeholder="Default" />
      <TextInput aria-label="Invalid" invalid placeholder="Invalid" />
      <TextInput aria-label="Disabled" disabled placeholder="Disabled" />
    </div>
  );
}
