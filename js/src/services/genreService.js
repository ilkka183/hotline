import http from '../services/httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/Genres';

export function getGenres() {
  return http.get(apiEndpoint);
}
