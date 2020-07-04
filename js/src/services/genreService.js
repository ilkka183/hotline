import http from '../services/httpService';
import config from '../config.json';

export function getGenres() {
  return http.get(config.apiEndpoint + '/Genres');
}
