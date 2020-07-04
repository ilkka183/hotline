import React from 'react';
import Joi from 'joi-browser';
import Form from '../components/common/Form';
import { getGenres } from '../services/fakeGenreService';
import { getMovie, saveMovie } from '../services/fakeMovieService';

export default class MovieForm extends Form {
  state = {
    data: {
      title: '',
      genreId: '',
      numberInStock: '',
      dailyRentalRate: ''
    },
    genres: [],
    errors: {}
  }

  schema = {
    _id: Joi.string(),
    title: Joi.string().required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().required().min(0).max(100),
    dailyRentalRate: Joi.number().required().min(0).max(10)
  }

  componentDidMount() {
    const genres = getGenres();
    this.setState({ genres });

    const movieId = this.props.match.params.id;

    if (movieId === 'new')
      return;

    const movie = getMovie(movieId);

    if (!movie)
      return this.props.history.replace('/not-found');

    this.setState({ data: this.mapToViewModel(movie) });
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    }
  }

  doSubmit() {
    saveMovie(this.state.data);

    this.props.history.push('/movies');
  }

  render() {
    return (
      <div>
        {this.renderHeader('Movie - ' + this.props.match.params.id)}
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('title', 'Title', 'text', true)}
          {this.renderSelect('genreId', 'Genre', this.state.genres)}
          {this.renderInput('numberInStock', 'Number in Stock', 'number')}
          {this.renderInput('dailyRentalRate', 'Rate')}
          {this.renderButton('Save')}
        </form>
      </div>
    );
  }
}
