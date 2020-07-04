import React from 'react';
import _ from 'lodash';

export default function TableBody({ columns, items }) {

  function renderCell(item, column) {
    if (column.content)
      return column.content(item);

    return _.get(item, column.path);
  }

  function createCellKey(item, column) {
    return item.Id + (column.path || column.key);
  }

  return (
    <tbody>
      { items.map(item => (
        <tr key={item.Id}>
          {columns.map(column => (<td key={createCellKey(item, column)}>{renderCell(item, column)}</td>))}
        </tr>)) }
    </tbody>
  );
}
