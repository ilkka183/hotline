import React from 'react';
import auth from '../../services/authService';

export default class Logout extends React.Component {
  public componentDidMount() {
    auth.logout();
    window.location.replace('/');
  }

  public render(): JSX.Element | null { 
    return null;
  }
}
