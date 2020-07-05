import jwtDecode from 'jwt-decode';
import http from '../services/httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/auth';
const tokenKey = 'token';

http.setJwt(getJwt());

export async function register(user) {
  const { data: jwt } = await http.post(apiEndpoint + '/register', user);
  localStorage.setItem(tokenKey, jwt);
}

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint + '/login', { email, password });
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getJwt
}