import React from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import DataInfo from './DataInfo'

const GROUPS = [
  'Alusta',
  'Ilmastointi ja lämmönhallinta',
  'Jarrut',
  'Korirankenteet',
  'Moottori',
  'Moottorinohjaus',
  'Sähköjärjestelmät',
  'Turvalaitteet',
  'Voimansiirto',
  'Vaihteisto',
  'Tiedonsiirto diagnoositestilaitteella',
  'Jokin muu'
];

export default function CompositionTitle({ data, title, onChange, onNext }) {
  return (
    <>
      <Button
        className="mt-2 mb-2"
        disabled={!title.group || (title.group === GROUPS[GROUPS.length - 1] && !title.groupOther) || !title.title}
        onClick={onNext}
      >
        Seuraava
      </Button>
      <DataInfo data={data} />
      <Form>
        <h4>Rakenneryhmä</h4>
        {GROUPS.map((group, index) => (
          <Form.Check
            type="radio"
            name="group"
            key={index}
            label={group}
            checked={group === title.group}
            value={group}
            onChange={onChange} />
        ))}
        <Form.Control
          name="groupOther"
          value={title.groupOther}
          onChange={onChange}
        />
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Vian otsikko</Form.Label>
          <Form.Control
            name="title"
            value={title.title}
            onChange={onChange}
          />
        </Form.Group>          
      </Form>
    </>
  );
}
