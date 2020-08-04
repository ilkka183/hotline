import jwtDecode from 'jwt-decode';
import http from '../services/httpService';

const apiEndpoint = '/auth';
const tokenKey = 'token';

const jwt = getJwt();
http.setJwt(jwt);


export const ROLE_ADMIN = 0;
export const ROLE_POWER = 1;
export const ROLE_USER = 2;
export const ROLE_DEMO = 3;


export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export async function register(user) {
  const { data: jwt } = await http.post(apiEndpoint + '/register', user);
  localStorage.setItem(tokenKey, jwt);
}

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint + '/login', { email, password });
  localStorage.setItem(tokenKey, jwt);
}

export async function changePassword(email, password, newPassword) {
  await http.post(apiEndpoint + '/changepassword', { email, password, newPassword });
}

export function logout() {
  localStorage.removeItem(tokenKey);
}


export default {
  getCurrentUser,
  getJwt,
  register,
  login,
  changePassword,
  logout
}
