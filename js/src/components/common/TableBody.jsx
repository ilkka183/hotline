import React from 'react';
import _ from 'lodash';

export default function TableBody({ columns, items }) {

  function renderCell(item, column) {
    if (column.content)
      return column.content(item);

    return _.get(item, column.path);
  }

  function createCellKey(item, column) {
    return item._id + (column.path || column.key);
  }

  return (
    <tbody>
      { items.map(item => (
        <tr key={item._id}>
          {columns.map(column => (<td key={createCellKey(item, column)}>{renderCell(item, column)}</td>))}
        </tr>)) }
    </tbody>
  );
}
