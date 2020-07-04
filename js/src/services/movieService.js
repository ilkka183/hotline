import http from '../services/httpService';
import config from '../config.json';

export function getMovies() {
  return http.get(config.apiEndpoint + '/Movies');
}

export function getMovie(id) {
  return http.get(config.apiEndpoint + '/Movie/' + id);
}

export function saveMovie(movie) {
  /*let movieInDb = movies.find(m => m._id === movie._id) || {};
  movieInDb.title = movie.title;
  movieInDb.genre = genresAPI.genres.find(g => g._id === movie.genreId);
  movieInDb.numberInStock = movie.numberInStock;
  movieInDb.dailyRentalRate = movie.dailyRentalRate;

  if (!movieInDb._id) {
    movieInDb._id = Date.now().toString();
    movies.push(movieInDb);
  }

  return movieInDb; */

  return null;
}

export function deleteMovie(id) {
/*  let movieInDb = movies.find(m => m._id === id);
  movies.splice(movies.indexOf(movieInDb), 1);
  return movieInDb; */

  return null;
}
