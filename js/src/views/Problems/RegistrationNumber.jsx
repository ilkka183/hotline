import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import http from '../../services/httpService';

export default class RegistrationNumberForm extends Component {
  state = {
    number: '',
    error: ''
  }

  handleChange = ({ currentTarget: input }) => {
    this.setState({ number: input.value, error: '' });
  }

  handleClear = () => {
    this.setState({ number: '', error: '' });

    this.props.onClear();
  }

  handleFill = (number) => {
    this.setState({ number });
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      this.setState({ error: '' });

      const { number } = this.state;
      const { data } = await http.get('/traficom/' + number);

      this.props.onSearch(data);
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404) {
        const error = 'Rekisterinumerolla ei löytynyt ajoneuvoa';

        this.setState({ error });
      }
    }
  }

  render() { 
    const { number, error } = this.state;

    return (
      <>
        <Form inline onSubmit={this.handleSubmit}>
          <Form.Control
            className="mb-2 mr-sm-2"
            placeholder="Rekisterinumero"
            value={number}
            onChange={this.handleChange}
  
          />          
          <Button className="mb-2 mr-sm-2" type="submit" disabled={!number}>Hae</Button>
          <Button className="mb-2 mr-sm-2" disabled={!number} onClick={this.handleClear}>Tyhjennä</Button>
          <Button className="mb-2 mr-sm-2" variant="light" onClick={() => this.handleFill('ZLP-833')}>Leon</Button>
          <Button className="mb-2 mr-sm-2" variant="light" onClick={() => this.handleFill('ISI-561')}>Golf</Button>
          <Button className="mb-2 mr-sm-2" variant="light" onClick={() => this.handleFill('SIO-913')}>Focus</Button>
        </Form>
        {error && <Alert variant="danger">{error}</Alert>}
      </>
    );
  }
}
