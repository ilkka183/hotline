import axios from 'axios';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/auth'

export function login(email: string, password: string) {
  const body = { email, password };
  console.log(body);
  
  return axios.post(apiEndpoint, body)
}