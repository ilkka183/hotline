import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import ListGroup from '../../components/common/ListGroup';
import Pagination from '../../components/common/Pagination';
import SearchBox from '../../components/common/SearchBox';
import MoviesTable from './MoviesTable';
import { getGenres } from '../../services/genreService';
import { getMovies, deleteMovie } from '../../services/movieService';
import { paginate } from '../../utils/paginate';
import auth from '../../services/authService';

export default class Movies extends Component {
  state = {
    genres: [],
    movies: [],
    searchQuery: '',
    selectedGenre: null,
    currentPage: 1,
    pageSize: 4,
    sortColumn: {
      path: 'title',
      order: 'asc'
    }
  }

  async componentDidMount() {
    const response1 = await getGenres();
    const genres = response1.data.rows;

    const response2 = await getMovies();
    const movies = response2.data.rows;

    const all = { Id: null, Name: 'All Genres' };

    this.setState({
      genres: [all, ...genres],
      movies
    });
  }

  handleDelete = async movie => {
    await deleteMovie(movie.Id);

    const movies = this.state.movies.filter(m => m.Id !== movie.Id);
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
    this.setState({ selectedGenre: genre, searchQuery: '', currentPage: 1 });
  }

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  }

  getPagedData() {
    const { searchQuery, selectedGenre, sortColumn, currentPage, pageSize } = this.state;

    const allMovies = this.state.movies;
    let filteredMovies = allMovies;

    if (searchQuery)
      filteredMovies = allMovies.filter(m => m.Title.toLowerCase().startsWith(searchQuery.toLowerCase()));
    else if (selectedGenre && selectedGenre.Id)
      filteredMovies = allMovies.filter(m => m.GenreId === selectedGenre.Id);

    const sortedMovies = _.orderBy(filteredMovies, [sortColumn.path], [sortColumn.order]);
    const movies = paginate(sortedMovies, currentPage, pageSize);

    return {
      totalCount: filteredMovies.length,
      movies
    }
  }

  render() {
    const user = auth.getCurrentUser();

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
          {user && <Link className="btn btn-primary" style={{ marginBottom: 20 }} to="/movies/new">New Movie</Link>}
          <p>Showing {totalCount} movies tn the database.</p>
          <SearchBox value={this.state.searchQuery} onChange={this.handleSearch} />
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
