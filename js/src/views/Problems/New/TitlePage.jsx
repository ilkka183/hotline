import React from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import DataInfo from './DataInfo'

export default function TitlePage({ data, onChange, onNext }) {
  return (
    <>
      <Button
        className="mt-2 mb-2"
        disabled={!data.Title}
        onClick={onNext}
      >
        Seuraava
      </Button>
      <DataInfo data={data} />
      <Form>
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
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Vian otsikko</Form.Label>
          <Form.Control
            name="Title"
            value={data.Title}
            onChange={onChange}
          />
        </Form.Group>          
      </Form>
    </>
  );
}
