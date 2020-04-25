import axios from 'axios';

export const rest = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 1000
});

export function setToken(token: string) {
  rest.defaults.headers.common['x-auth-token'] = token;
}