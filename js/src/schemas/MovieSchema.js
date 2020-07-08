import { Schema } from './Schema';
import { getGenres } from '../services/genreService';

export default class MovieSchema extends Schema {
  constructor() {
    super('Movie');

    this.addField('Id', 'Id', 'number', { primaryKey: true, required: true, visibleInForm: false });
    this.addField('Title', 'Title', 'text', { required: true, editLink: true });
    this.addField('GenreId', 'Genre', 'number', { required: true, lookupFunc: getGenres });
    this.addField('GenreName', 'Genre', 'text', { visibleInForm: false });
    this.addField('NumberInStock', 'Stock', 'number', { required: true, min: 0, max: 100 });
    this.addField('DailyRentalRate', 'Rate', 'number', { required: true, min: 0, max: 10 });
    this.addField('Enabled', 'Enabled', 'boolean', { required: true });
  }

  get singularTitle() {
    return 'Movie';
  }

  get pluralTitle() {
    return 'Movies';
  }

  get pluralName() {
    return 'movies';
  }
}
