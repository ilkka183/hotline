import React, { Component } from 'react';
import _ from 'lodash';
import ListGroup from './common/ListGroup';
import Pagination from './common/Pagination';
import MoviesTable from './MoviesTable';
import { getGenres } from '../services/fakeGenreService';
import { getMovies } from '../services/fakeMovieService';
import { paginate } from '../utils/paginate';

export default class Movies extends Component {
  state = {
    genres: [],
    movies: [],
    selectedGenre: null,
    currentPage: 1,
    pageSize: 4,
    sortColumn: {
      path: 'title',
      order: 'asc'
    }
  }

  componentDidMount() {
    const genres = [{ _id: null, name: 'All Genres' }, ...getGenres()];

    this.setState({
      genres,
      movies: getMovies()
    });
  }

  handleDelete = movie => {
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies });
  }

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = {...movies[index]};
    movies[index].liked = !movies[index].liked;

    this.setState({ movies });
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  }

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, currentPage: 1 });
  }

  getPagedData() {
    const allMovies = this.state.movies;

    const filteredMovies = this.state.selectedGenre && this.state.selectedGenre._id
      ? allMovies.filter(m => m.genre._id === this.state.selectedGenre._id)
      : allMovies;

    const sortedMovies = _.orderBy(filteredMovies, [this.state.sortColumn.path], [this.state.sortColumn.order]);

    const movies = paginate(
      sortedMovies,
      this.state.currentPage,
      this.state.pageSize);

    return {
      totalCount: filteredMovies.length,
      movies
    }
  }

  render() {
    if (this.state.movies.length === 0)
      return <p>There are no movies in the database.</p>

    const { totalCount, movies } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          <p>Showing {totalCount} movies tn the database.</p>
          <Pagination
            itemsCount={totalCount}
            pageSize={this.state.pageSize}
            currentPage={this.state.currentPage}
            onPageChange={this.handlePageChange}
          />
          <MoviesTable
            movies={movies}
            sortColumn={this.state.sortColumn}
            onDelete={this.handleDelete}
            onLike={this.handleLike}
            onSort={this.handleSort}
          />
        </div>
      </div>
    );
  }
}
