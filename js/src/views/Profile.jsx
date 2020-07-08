import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import auth from '../services/authService';

export default class Profile extends Component {
  render() { 
    const user = auth.getCurrentUser();

    return (
      <Container fluid>
        <h1>Profiili - {user.firstName}</h1>
      </Container>
    );
  }
}
