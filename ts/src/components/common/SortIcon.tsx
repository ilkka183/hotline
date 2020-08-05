import React from 'react';

export default function SortIcon({ order }) {
  if (order === 'asc')
    return <i className="fa fa-sort-asc" />;

  if (order === 'desc')
    return <i className="fa fa-sort-desc" />;

  return null;
}
