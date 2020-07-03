import React from 'react';
import { Link } from 'react-router-dom';
import Like from '../components/common/Like';
import Table from '../components/common/Table';

export default function MoviesTable({ movies, sortColumn, onDelete, onLike, onSort }) {

  const columns = [
    { path: 'title', label: 'Title', content: movie => <Link to={`/movies/${movie._id}`}>{movie.title}</Link> },
    { path: 'genre.name', label: 'Genre' },
    { path: 'numberInStock', label: 'Stock' },
    { path: 'dailyRentalRate', label: 'Rate' },
    { key: 'like', content: movie => <Like liked={movie.liked} onClick={() => onLike(movie)} /> },
    { key: 'delete', content: movie => <button className="btn btn-danger btn-sm" onClick={() => onDelete(movie)}>Delete</button> }
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
