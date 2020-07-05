import React from 'react';
import MyTableHeader from './MyTableHeader';
import MyTableBody from './MyTableBody';

export default function MyTable({ columns, items, sortColumn, onSort }) {
  return (
    <table className="table">
      <MyTableHeader
        columns={columns}
        sortColumn={sortColumn}
        onSort={onSort}
      />
      <MyTableBody
        columns={columns}
        items={items}
      />
    </table>
  );
}
