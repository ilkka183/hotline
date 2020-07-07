import DataForm from './DataForm';
import MovieSchema from '../schemas/MovieSchema';

export default class MovieForm extends DataForm {
  schema = new MovieSchema();

  state = {
    data: this.schema.initFormData(),
    errors: {}
  }

  genres = [];

  getTitle() {
    return 'Movie';
  }

  getRestName() {
    return 'movies';
  }

  itemToData(item) {
    return {
      Id: item.Id,
      Title: item.Title,
      GenreId: item.GenreId,
      GenreName: item.GenreName,
      NumberInStock: item.NumberInStock,
      DailyRentalRate: item.DailyRentalRate
    }
  }
}
