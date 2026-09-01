import { componentClassNames } from '../../shared/index.js';
import type { TableProps } from './Table.types.js';
import { tableClassName } from './Table.styles.js';

export function Table({ caption, headers, rows = [], children, className, ...props }: TableProps) {
  return (
    <div className="dui-table-wrapper" data-dui-table-wrapper="">
      <table
        {...props}
        className={componentClassNames(tableClassName, className)}
        data-dui-table=""
      >
        <caption>{caption}</caption>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {children ?? (
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
