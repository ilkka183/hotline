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

export default function CompositionTitle({ data, title, onChange, onPrev, onNext }) {

  function renderGroups() {
    return (
      <Form.Group>
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
      </Form.Group>          
    );
  }

  function renderTitle() {
    return (
      <Form.Group>
        <Form.Label>Vian otsikko</Form.Label>
        <Form.Control
          name="title"
          value={title.title}
          onChange={onChange}
        />
      </Form.Group>          
    );
  }

  function ready() {
    return title.group &&
      (title.group !== GROUPS[GROUPS.length - 1] || title.groupOther) &&
      title.title;
  }

  return (
    <>
      <DataInfo data={data} />
      <h3>Rakenneryhmä</h3>
      <Form>
        {renderGroups()}
        {renderTitle()}
      </Form>
      <Button className="mr-2" onClick={onPrev}>Edellinen</Button>
      <Button disabled={!ready()} onClick={onNext}>Seuraava</Button>
    </>
  );
}
