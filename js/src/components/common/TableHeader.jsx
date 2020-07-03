import React from 'react';

export default function TableHeader({ columns, sortColumn, onSort }) {

  function raiseSort(path) {
    const newSortColumn = {...sortColumn}

    if (newSortColumn.path === path)
      newSortColumn.order = (newSortColumn.order === 'asc') ? 'desc' : 'asc';
    else {
      newSortColumn.path = path;
      newSortColumn.order = 'asc';
    }

    onSort(newSortColumn);
  }

  function renderSortIcon(column) {
    if (column.path === sortColumn.path)
    {
      if (sortColumn.order === 'asc')
        return <i className="fa fa-sort-asc" />;

      if (sortColumn.order === 'desc')
        return <i className="fa fa-sort-desc" />;
    }

    return null;
  }

  return (
    <thead>
      <tr>
        {columns.map(column => (
          <th
            className="clickable"
            key={column.path || column.key}
            onClick={() => raiseSort(column.path)}
          >
            {column.label} {renderSortIcon(column)}
          </th>
        ))}
      </tr>
    </thead>
  );
}
