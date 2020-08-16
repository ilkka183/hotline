import React from 'react';
import Pagination from 'react-bootstrap/Pagination'

interface Props {
  rowCount: number,
  pageIndex: number,
  pageSize: number,
  onPageChange: (index: number) => void
}

const DataPagination: React.FC<Props> = ({ rowCount, pageIndex, pageSize, onPageChange }) => {
  const pageCount: number = Math.ceil(rowCount/pageSize);

  if (pageCount <= 1)
    return null;

  const pages: number[] = [];

  for (let i: number = 0; i < pageCount; i++)
    pages.push(i);

  function changePage(index: number) {
    if ((index >= 0) && (index < pageCount))
      onPageChange(index);
  }

  return (
    <Pagination>
      <Pagination.Prev onClick={() => changePage(pageIndex - 1)}>Edellinen</Pagination.Prev>
      {pages.map(index => (
        <Pagination.Item
          key={index}
          active={index === pageIndex}
          onClick={() => changePage(index)}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={() => changePage(pageIndex + 1)}>Seuraava</Pagination.Next>
      <div className="pagination-rows">{rowCount} riviä</div>
    </Pagination>
  );
}

export default DataPagination;
