import React from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

export default function Table({ columns, items, sortColumn, onSort }) {
  return (
    <table className="table">
      <TableHeader
        columns={columns}
        sortColumn={sortColumn}
        onSort={onSort}
      />
      <TableBody
        columns={columns}
        items={items}
      />
    </table>
  );
}
