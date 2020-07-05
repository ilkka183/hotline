import http from '../services/httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/Users';

export function register(user) {
  return http.post(apiEndpoint, user);
}
