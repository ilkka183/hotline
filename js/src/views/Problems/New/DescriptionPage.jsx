import React from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import DataInfo from './DataInfo'

export default function DescriptionPage({ data, onChange, onPrev, onNext }) {
  return (
    <>
      <Button
        className="mt-2 mb-2 mr-2"
        onClick={onPrev}
      >
        Edellinen
      </Button>
      <Button
        className="mt-2 mb-2"
        disabled={!data.Description}
        onClick={onNext}
      >
        Seuraava
      </Button>
      <DataInfo data={data} />
      <h4>Vian kuvaus</h4>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Control
            as="textarea"
            rows={5}
            name="Description"
            value={data.Description}
            onChange={onChange}
          />
        </Form.Group>          
      </Form>
    </>
  );
}
