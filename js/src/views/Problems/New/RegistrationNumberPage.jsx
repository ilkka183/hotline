import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import RegistrationNumber from './RegistrationNumber'

export default class RegistrationNumberPage extends Component {
  render() { 
    return (
      <>
        <Button className="mb-2" onClick={this.props.onNext}>Ohita</Button>
        <h3>Hae ajoneuvon tiedot rekisterinumerolla</h3>
        <RegistrationNumber onSearch={this.handleRegistrationNumberSearch} onClear={this.handleRegistrationNumberClear} />
      </>
    );
  }
}
