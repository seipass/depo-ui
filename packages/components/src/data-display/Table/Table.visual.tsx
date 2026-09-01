import { Table } from './Table.js';

export function TableVisualFixture() {
  return <Table caption="Accounts" headers={['Name', 'Status']} rows={[['Acme', 'Active']]} />;
}
