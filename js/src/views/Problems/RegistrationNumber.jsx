import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import http from '../../services/httpService';
import { apiUrl } from '../../config.json';

export default class LicenseNumberForm extends Component {
  state = {
    registrationNumber: ''
  }

  handleChange = ({ currentTarget: input }) => {
    this.setState({ registrationNumber: input.value });
  }

  handleClear = () => {
    this.setState({ registrationNumber: '' });
  }

  handleFill = (registrationNumber) => {
    this.setState({ registrationNumber });
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const { registrationNumber } = this.state;
    const { data } = await http.get(apiUrl + '/traficom/' + registrationNumber);

    this.props.onFound(data);
  }

  render() { 
    return (
      <Form inline onSubmit={this.handleSubmit}>
        <Form.Control
          className="mb-2 mr-sm-2"
          placeholder="Rekisterinumero"
          value={this.state.registrationNumber}
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
