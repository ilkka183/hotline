import { Component } from 'react';
import auth, { User } from '../services/authService';

export default class UserComponent<P, S> extends Component<P, S> {
  protected readonly user: User | null = auth.getCurrentUser();
}
