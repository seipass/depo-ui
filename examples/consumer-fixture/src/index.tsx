import { Button, Card, Field, TextInput } from '@depo-ui/react';

export function ConsumerFixture() {
  return (
    <Card>
      <Field label="Project name" required>
        <TextInput name="projectName" />
      </Field>
      <Button type="submit">Create project</Button>
    </Card>
  );
}
