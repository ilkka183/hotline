import { Component } from 'react';
import auth from '../../services/authService';

export default class Logout extends Component {
  public componentDidMount(): void {
    auth.logout();
    window.location.replace('/');
  }

  public render(): JSX.Element | null { 
    return null;
  }
}
