import { Schema } from './Schema';
import { getGenres } from '../services/genreService';

export default class MovieSchema extends Schema {
  constructor() {
    super('Movie');

    this.addField('Id', 'number', { primaryKey: true, required: true, visibleInForm: false });
    this.addField('Title', 'text', { required: true, link: movie => '/movies/' + movie.Id });
    this.addField('GenreId', 'number', { title: 'Genre', required: true, lookupFunc: getGenres });
    this.addField('GenreName', 'text', { title: 'Genre', visibleInForm: false });
    this.addField('NumberInStock', 'number', { title: 'Stock', required: true, min: 0, max: 100 });
    this.addField('DailyRentalRate', 'number', { title: 'Rate', required: true, min: 0, max: 10 });
  }

  get singleTitle() {
    return 'Movie';
  }

  get pluralTitle() {
    return 'Movies';
  }

  get pluralName() {
    return 'movies';
  }
}
