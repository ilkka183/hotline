import React from 'react';
import { Link } from 'react-router-dom';
import Like from '../components/common/Like';
import Table from '../components/common/Table';

export default function MoviesTable({ movies, sortColumn, onDelete, onLike, onSort }) {

  const columns = [
    { path: 'Title', label: 'Title', content: movie => <Link to={`/movies/${movie.Id}`}>{movie.Title}</Link> },
    { path: 'GenreName', label: 'Genre' },
    { path: 'NumberInStock', label: 'Stock' },
    { path: 'DailyRentalRate', label: 'Rate' },
    { key: 'Like', content: movie => <Like liked={movie.liked} onClick={() => onLike(movie)} /> },
    { key: 'Delete', content: movie => <button className="btn btn-danger btn-sm" onClick={() => onDelete(movie)}>Delete</button> }
  ]

  return (
    <Table
      columns={columns}
      items={movies}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
}
