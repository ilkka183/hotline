import jwtDecode from 'jwt-decode';
import http from './httpService';

export enum UserRole {
  Admin,
  Power,
  User,
  Demo
}

interface IUser {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  role: UserRole
}

export class User implements IUser {
  public readonly id: number;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly phone: string;
  public readonly role: UserRole;

  constructor(user: IUser) {
    this.id = user.id;
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
