import React from 'react';
import { Link } from 'react-router-dom';
import Like from '../../components/common/Like';
import Table from '../../components/common/Table';
import auth from '../../services/authService';

export default function MoviesTable({ movies, sortColumn, onDelete, onLike, onSort }) {
  const user = auth.getCurrentUser();

  function getTitle(movie) {
    if (user)
      return <Link to={`/movies/${movie.Id}`}>{movie.Title}</Link>;

    return movie.Title;
  }

  let columns = [
    { path: 'Title', label: 'Title', content: movie => getTitle(movie) },
    { path: 'GenreName', label: 'Genre' },
    { path: 'NumberInStock', label: 'Stock' },
    { path: 'DailyRentalRate', label: 'Rate' },
  ]

  if (user && user.role === 0)
  {
    columns.push({ key: 'Like', content: movie => <Like liked={movie.liked} onClick={() => onLike(movie)} /> });
    columns.push({ key: 'Delete', content: movie => <button className="btn btn-danger btn-sm" onClick={() => onDelete(movie)}>Delete</button> });
  }

  return (
    <Table
      columns={columns}
      items={movies}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
}
