import React from 'react';
import Joi from 'joi-browser';
import Form from '../components/common/Form';
import { getGenres } from '../services/genreService';
import { getMovie, saveMovie } from '../services/movieService';

export default class MovieForm extends Form {
  state = {
    data: {
      Title: '',
      GenreId: '',
      NumberInStock: '',
      DailyRentalRate: ''
    },
    genres: [],
    errors: {}
  }

  schema = {
    Id: Joi.string(),
    Title: Joi.string().required(),
    GenreId: Joi.string().required(),
    NumberInStock: Joi.number().required().min(0).max(100),
    DailyRentalRate: Joi.number().required().min(0).max(10)
  }

  async componentDidMount() {
    const response1 = await getGenres();
    this.setState({ genres: response1.data.rows });

    const movieId = this.props.match.params.id;

    if (movieId === 'new')
      return;

    const response2 = await getMovie(movieId);

    if (response2.data.length === 0)
      return this.props.history.replace('/not-found');

    this.setState({ data: response2.data[0] });
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
          {this.renderInput('Title', 'Title', 'text', true)}
          {this.renderSelect('GenreId', 'Genre', this.state.genres)}
          {this.renderInput('NumberInStock', 'Number in Stock', 'number')}
          {this.renderInput('DailyRentalRate', 'Rate')}
          {this.renderButton('Save')}
        </form>
      </div>
    );
  }
}
