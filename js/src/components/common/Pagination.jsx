import React from 'react';
import PropTypes from 'prop-types';

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
}

export default function Pagination({ itemsCount, pageSize, currentPage, onPageChange }) {
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
    <ul className="pagination">
      <li className="page-item"><span className="page-link" onClick={changePage(currentPage - 1)}>Previous</span></li>
      {pages.map(page => (
        <li
          className={ page === currentPage ? "page-item active" : "page-item" }
          key={page}
        >
          <span className="page-link" onClick={changePage(page)}>{page}</span>
        </li>
      ))}
      <li className="page-item"><span className="page-link" onClick={changePage(currentPage + 1)}>Next</span></li>
    </ul>
  );
}
