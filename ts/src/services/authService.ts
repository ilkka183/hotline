import jwtDecode from 'jwt-decode';
import http from './httpService';

export enum UserRole {
  Admin = 0,
  Power,
  User,
  Demo
}

export const USER_ROLES = [
  'pääkäyttäjä',
  'tehokäyttäjä',
  'käyttäjä',
  'demokäyttäjä'
];

interface IUser {
  id: number,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  role: UserRole
}

export class User implements IUser {
  public readonly id: number;
  public readonly username: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly phone: string;
  public readonly role: UserRole;

  constructor(user: IUser) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phone = user.phone;
    this.role = user.role;
  }

  public get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  public get isPowerOrAdmin(): boolean {
    return this.role <= UserRole.Power;
  }

  public owns(userId: number): boolean {
    return userId === this.id || this.isPowerOrAdmin;
  }
}

const apiEndpoint: string = '/auth';
const tokenKey: string = 'token';

const jwt: string | null = getJwt();
http.setJwt(jwt);

export function getJwt(): string | null {
  return localStorage.getItem(tokenKey);
}

export function getCurrentUser(): User | null {
  try {
    const jwt: string | null = localStorage.getItem(tokenKey);

    if (jwt) {
      const data: IUser = jwtDecode<User>(jwt!);
      return new User(data)
    }

    return null;
  } catch (ex) {
    return null;
  }
}

export async function register(user: User) {
  const { data: jwt } = await http.post(apiEndpoint + '/register', user);
  localStorage.setItem(tokenKey, jwt);
}

export async function login(username: string, password: string) {
  const { data: jwt } = await http.post(apiEndpoint + '/login', { username, password });
  localStorage.setItem(tokenKey, jwt);
}

export async function logout() {
  const user: User | null = getCurrentUser();

  localStorage.removeItem(tokenKey);
  
  if (user)
    await http.post(apiEndpoint + '/logout', { userId: user.id });
}

export async function changePassword(username: string, password: string, newPassword: string) {
  await http.post(apiEndpoint + '/changepassword', { username, password, newPassword });
}

export default {
  getCurrentUser,
  getJwt,
  register,
  login,
  logout,
  changePassword
}
