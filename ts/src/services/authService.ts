import axios from 'axios';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/auth'

export function login(username: string, password: string) {
  const body = { username, password };
  console.log(body);
  
  return axios.post(apiEndpoint, body)
}