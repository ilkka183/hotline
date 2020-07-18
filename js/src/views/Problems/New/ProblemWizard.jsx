import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default class ProblemWizard extends Component {
  state = {
    data: null
  }

  render() { 
    return (
      <>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Vian otsikko</Form.Label>
            <Form.Control />
          </Form.Group>          
          <h4>Rakenneryhmä</h4>
          <Form.Check type="radio" label="Alusta" />
          <Form.Check type="radio" label="Ilmastointi ja lämmönhallinta" />
          <Form.Check type="radio" label="Jarrut" />
          <Form.Check type="radio" label="Korirankenteet" />
          <Form.Check type="radio" label="Moottori" />
          <Form.Check type="radio" label="Moottorinohjaus" />
          <Form.Check type="radio" label="Sähköjärjestelmät" />
          <Form.Check type="radio" label="Turvalaitteet" />
          <Form.Check type="radio" label="Voimansiirto" />
          <Form.Check type="radio" label="Vaihteisto" />
          <Form.Check type="radio" label="Tiedonsiirto diagnoositestilaitteella" />
          <Form.Check type="radio" label="Jokin Muu" inline />
          <Form.Control />
          <Button variant="primary">Seuraava</Button>          
        </Form>
      </>
    );
  }
}
