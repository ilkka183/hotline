import jwtDecode from 'jwt-decode';
import http from './httpService';

export enum UserRole {
  Admin,
  Power,
  User,
  Demo
}

export interface User {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  role: UserRole
}

const apiEndpoint = '/auth';
const tokenKey = 'token';

const jwt: string | null = getJwt();
http.setJwt(jwt);

export function getJwt(): string | null {
  return localStorage.getItem(tokenKey);
}

export function getCurrentUser(): User | null {
  try {
    const jwt: string | null = localStorage.getItem(tokenKey);
    return jwt ? jwtDecode<User>(jwt!) : null;
  } catch (ex) {
    return null;
  }
}

export async function register(user: User) {
  const { data: jwt } = await http.post(apiEndpoint + '/register', user);
  localStorage.setItem(tokenKey, jwt);
}

export async function login(email: string, password: string) {
  const { data: jwt } = await http.post(apiEndpoint + '/login', { email, password });
  localStorage.setItem(tokenKey, jwt);
}

export async function changePassword(email: string, password: string, newPassword: string) {
  await http.post(apiEndpoint + '/changepassword', { email, password, newPassword });
}

export function logout(): void {
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
