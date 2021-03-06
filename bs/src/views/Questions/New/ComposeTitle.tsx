import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import QuestionSummary from '../QuestionSummary'
import { TESTING } from '../Questions';

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

interface Props {
  data: any,
  title: any,
  onChange: (event: any) => void,
  onFill: (title: any) => void
}

const ComposeTitle: React.FC<Props> = ({ data, title, onChange, onFill }) => {

  function renderGroups(): JSX.Element {
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

  function renderTitle(): JSX.Element {
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

  const handleFill = () => {
    const newTitle = {...title}
    newTitle.group = GROUPS[0];
    newTitle.title = 'Ei toimi';
    
    onFill(newTitle);
  }

  function renderTestButton(): JSX.Element {
    return <Button className="mr-2" variant="light" onClick={handleFill}>Testi</Button>
  }

  return (
    <>
      <QuestionSummary data={data} />
      <h3>Rakenneryhmä</h3>
      <Form>
        {renderGroups()}
        {renderTitle()}
      </Form>
      {TESTING && renderTestButton()}
    </>
  );
}

export default ComposeTitle;
