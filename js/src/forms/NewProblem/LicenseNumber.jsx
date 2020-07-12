import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default class LicenseNumberForm extends Component {
  state = {
    licenseNumber: ''
  }

  handleChange = ({ currentTarget: input }) => {
    this.setState({ licenseNumber: input.value });
  }

  handleClear = () => {
    this.setState({ licenseNumber: '' });
  }

  handleFill = (licenseNumber) => {
    this.setState({ licenseNumber });
  }

  handleSubmit = e => {
    e.preventDefault();

    console.log(this.state.licenseNumber);
  }

  render() { 
    return (
      <Form inline onSubmit={this.handleSubmit}>
        <Form.Control
          className="mb-2 mr-sm-2"
          placeholder="Rekisterinumero"
          value={this.state.licenseNumber}
          onChange={this.handleChange}
 
        />          
        <Button className="mb-2 mr-sm-2" type="submit">Hae</Button>
        <Button className="mb-2 mr-sm-2" onClick={this.handleClear}>Tyhjennä</Button>
        <Button className="mb-2 mr-sm-2" variant="light" onClick={() => this.handleFill('ZLP-833')}>Leon</Button>
        <Button className="mb-2 mr-sm-2" variant="light" onClick={() => this.handleFill('ISI-561')}>Golf</Button>
        <Button className="mb-2 mr-sm-2" variant="light" onClick={() => this.handleFill('SIO-913')}>Focus</Button>
      </Form>
    );
  }
}
