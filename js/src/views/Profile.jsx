import React, { Component } from 'react';
import auth from '../services/authService';

export default class Profile extends Component {
  render() { 
    const user = auth.getCurrentUser();

    return (
      <h2>Profiili - {user.firstName}</h2>
    );
  }
}
