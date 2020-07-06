import { Schema } from './Schema';

export default class MovieSchema extends Schema {
  constructor() {
    super('Movie');

    this.addField('Title', 'Title', 'text', { link: movie => '/movies/' + movie.Id, required: true });
    this.addField('GenreName', 'Genre', 'number', { required: true });
    this.addField('NumberInStock', 'Stock', 'number', { min: 0, max: 100, required: true });
    this.addField('DailyRentalRate', 'Rate', 'number', { min: 0, max: 10, required: true });
  }

  get singleTitle() {
    return 'Movie';
  }

  get pluralTitle() {
    return 'Movies';
  }

  get restName() {
    return 'movies';
  }
}
