import http from '../services/httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/Movies';

function itemUrl(id) {
  return apiEndpoint + '/' + id;
}

export function getMovies() {
  return http.get(apiEndpoint);
}

export function getMovie(id) {
  return http.get(itemUrl(id));
}

export function saveMovie(movie) {
  if (movie.Id)
    return http.put(itemUrl(movie.Id), movie);
  else
    return http.post(apiEndpoint, movie);
}

export function deleteMovie(id) {
  return http.delete(itemUrl(id));
}
