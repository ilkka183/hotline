import React from 'react';
import Form from 'react-bootstrap/Form'
import ProblemSummary from '../ProblemSummary'

export const GROUPS = [
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

export default function ComposeTitle({ data, title, onChange }) {

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
          disabled={title.group !== GROUPS[GROUPS.length - 1]}
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

  return (
    <>
      <ProblemSummary data={data} />
      <h3>Rakenneryhmä</h3>
      <Form>
        {renderGroups()}
        {renderTitle()}
      </Form>
    </>
  );
}
