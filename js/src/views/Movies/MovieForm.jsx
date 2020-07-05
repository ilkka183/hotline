import React from 'react';
import Joi from 'joi-browser';
import Form from 'react-bootstrap/Form'
import BaseForm from '../../components/common/BaseForm';
import { getGenres } from '../../services/genreService';
import { getMovie, saveMovie } from '../../services/movieService';

export default class MovieForm extends BaseForm {
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
    Id: Joi.number(),
    Title: Joi.string().required(),
    GenreId: Joi.number().required(),
    NumberInStock: Joi.number().required().min(0).max(100),
    DailyRentalRate: Joi.number().required().min(0).max(10)
  }

  get movieId() {
    return this.props.match.params.id;
  }

  async populateGenres() {
    const { data } = await getGenres();
    this.setState({ genres: data.rows });
  }

  async populateMovie() {
    try {
      const { data: movie } = await getMovie(this.movieId);

      const data = {
        Id: movie.Id,
        Title: movie.Title,
        GenreId: movie.GenreId,
        NumberInStock: movie.NumberInStock,
        DailyRentalRate: movie.DailyRentalRate
      }

      this.setState({ data });
    }  catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populateGenres();

    if (this.movieId !== 'new')
      await this.populateMovie();
  }

  async doSubmit() {
    await saveMovie(this.state.data);

    this.props.history.push('/movies');
  }

  render() {
    return (
      <>
        {this.renderHeader('Movie - ' + this.movieId)}
        <Form onSubmit={this.handleSubmit}>
          {this.renderInput('Title', 'Title', 'text', true)}
          {this.renderSelect('GenreId', 'Genre', this.state.genres)}
          {this.renderInput('NumberInStock', 'Number in Stock', 'number')}
          {this.renderInput('DailyRentalRate', 'Rate')}
          {this.renderButton('Save')}
        </Form>
      </>
    );
  }
}
