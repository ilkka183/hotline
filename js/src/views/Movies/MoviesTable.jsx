import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import MyTable from '../../components/common/MyTable';
import Like from '../../components/common/Like';
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
    columns.push({ key: 'Delete', content: movie => <Button variant="danger" size="sm" onClick={() => onDelete(movie)}>Delete</Button> });
  }

  return (
    <MyTable
      columns={columns}
      items={movies}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
}
