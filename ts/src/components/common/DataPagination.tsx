import React from 'react';
import PropTypes from 'prop-types';
import Pagination from 'react-bootstrap/Pagination'

interface Props {
  rowCount: number,
  pageIndex: number,
  pageSize: number,
  onPageChange: (index: number) => void
}

const DataPagination: React.FC<Props> = ({ rowCount, pageIndex, pageSize, onPageChange }) => {
  const pageCount = Math.ceil(rowCount/pageSize);

  if (pageCount <= 1)
    return null;

  const pages = [];

  for (let i = 0; i < pageCount; i++)
    pages.push(i);

  function changePage(index: number): void {
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

DataPagination.propTypes = {
  rowCount: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
}
