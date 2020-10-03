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

  function renderPage(index: number) {
    const WIDTH = 20;
    const leftOffset = pageIndex;
    const rightOffset = pageCount - pageIndex;
    
    let left;
    let right;

    if (leftOffset < rightOffset) {
      left = Math.min(leftOffset, WIDTH/2);
      right = WIDTH - left;
    } else {
      right = Math.min(rightOffset, WIDTH/2);
      left = WIDTH - right;
    }

    const visible = (index === 0) ||
      (index === pageCount - 1) ||
      ((index > pageIndex - left) && (index < pageIndex + right))

    if (visible)
      return (
        <Pagination.Item
          key={index}
          active={index === pageIndex}
          onClick={() => changePage(index)}
        >
          {index + 1}
        </Pagination.Item>
      );
    else if ((index === pageIndex - left) || (index === pageIndex + right))
      return <Pagination.Ellipsis key={index} />
    else
      return null;
  }

  return (
    <Pagination>
      <Pagination.First onClick={() => changePage(0)} />
      <Pagination.Prev onClick={() => changePage(pageIndex - 1)} />
      {pages.map(index => renderPage(index))}
      <Pagination.Next onClick={() => changePage(pageIndex + 1)} />
      <Pagination.Last onClick={() => changePage(pageCount - 1)} />
      <div className="pagination-rows">{rowCount} riviä</div>
    </Pagination>
  );
}

export default DataPagination;
