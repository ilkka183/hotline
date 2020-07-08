import React from 'react';
import PropTypes from 'prop-types';
import Pagination from 'react-bootstrap/Pagination'

DataPagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
}

export default function DataPagination({ itemsCount, pageSize, currentPage, onPageChange }) {
  const pagesCount = Math.ceil(itemsCount/pageSize);

  if (pagesCount <= 1)
    return null;

  const pages = [];

  for (let i = 1; i <= pagesCount; i++)
    pages.push(i);

  function changePage(page) {
    if ((page < 1) || (page > pagesCount))
      return null;

    return () => onPageChange(page);
  }

  return (
    <Pagination>
      <Pagination.Prev onClick={changePage(currentPage - 1)}>Edellinen</Pagination.Prev>
      {pages.map(page => (
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={changePage(page)}
        >
          {page}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={changePage(currentPage + 1)}>Seuraava</Pagination.Next>
    </Pagination>
  );
}
