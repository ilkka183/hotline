import React from 'react';
import Joi from 'joi-browser';
import DataForm from './DataForm';
import { getGenres } from '../services/genreService';

export default class MovieForm extends DataForm {
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

  itemToData(item) {
    return {
      Id: item.Id,
      Title: item.Title,
      GenreId: item.GenreId,
      NumberInStock: item.NumberInStock,
      DailyRentalRate: item.DailyRentalRate
    }
  }

  getRestName() {
    return 'movies';
  }

  async populateOthers() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  renderControls() {
    return (
      <>
        {this.renderInput('Title', 'Title', 'text', true)}
        {this.renderSelect('GenreId', 'Genre', this.state.genres)}
        {this.renderInput('NumberInStock', 'Number in Stock', 'number')}
        {this.renderInput('DailyRentalRate', 'Rate')}
      </>
    );
  }
}
