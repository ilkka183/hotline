import React from 'react';
import { SortOrder } from './Fields';

interface Props {
  order: SortOrder
}

const SortIcon: React.FC<Props> = ({ order }) => {
  if (order === SortOrder.Asc)
    return <i className="fa fa-sort-asc" />;

  if (order === SortOrder.Desc)
    return <i className="fa fa-sort-desc" />;

  return null;
}

export default SortIcon;
