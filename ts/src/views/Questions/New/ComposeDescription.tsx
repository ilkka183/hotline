import React from 'react';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import QuestionSummary from '../QuestionSummary'
import Required from '../../../components/form/Required';
import { TESTING } from '../Questions';

const APPEARANCES = [
  'Jatkuva',
  'Ajoittainen, esiintymistiheys'
];

const DIAGNOSTIC = [
  'Järjestelmässä ei ole diagnostiikkaa',
  'Testilaitteeme ei tue ko. järjestelmää',
  'Vikamuistissa ei ole vikakoodeja',
  'Vikamuistissa vikakoodit'
];

export const TESTERS = [
  'Texa',
  'Crypton',
  'Bosch',
  'Gutmann',
  'Autocom',
  'Technotest',
  'OEM-laite',
  'Yleinen OBD-työkalu',
  'Jokin muu'
];

interface Props {
  data: any,
  description: any,
  onChange: (event: any) => void,
  onChangeCheckboxGroup: (event: any) => void,
  onFill: (description: any) => void
}

const ComposeDescription: React.FC<Props> = ({ data, description, onChange, onChangeCheckboxGroup, onFill }) => {

  function renderDescription(): JSX.Element {
    return (
      <Form.Group>
        <Form.Label>Asiakkaan viankuvaus <Required /></Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={description.description}
          onChange={onChange}
        />
      </Form.Group>          
    );
  }

  function renderAppearance(): JSX.Element {
    return (
      <Form.Group>
      <Form.Label>Vian ensiintyminen</Form.Label>
        {APPEARANCES.map((item: any, index: number) => (
          <Form.Check
            type="radio"
            name="appearance"
            key={index}
            label={item}
            checked={item === description.appearance}
            value={item}
            onChange={onChange} />
        ))}
        <Form.Control
          name="appearanceFrequency"
          value={description.appearanceFrequency}
          onChange={onChange}
        />
      </Form.Group>
    );
  }

  function renderDiagnostic(): JSX.Element {
    return (
      <Form.Group>
      <Form.Label>Itsediagnostiikka</Form.Label>
        {DIAGNOSTIC.map((item: any, index: number) => (
          <Form.Check
            type="radio"
            name="diagnostic"
            key={index}
            label={item}
            checked={item === description.diagnostic}
            value={item}
            onChange={onChange} />
        ))}
        <Form.Control
          as="textarea"
          rows={3}
          name="diagnosticCodes"
          value={description.diagnosticCodes}
          onChange={onChange}
        />
      </Form.Group>          
    );
  }

  function renderTester(): JSX.Element {
    return (
      <Form.Group>
        <Form.Label>Käytetyt testilaitteet</Form.Label>
        {TESTERS.map((item: any, index: number) => (
          <Form.Check
            type="checkbox"
            name="testers"
            id={(index + 1).toString()}
            key={index}
            label={item}
            checked={description.testers[index]}
            onChange={onChangeCheckboxGroup} />
        ))}
        <Form.Control
          name="testerOther"
          value={description.testerOther}
          onChange={onChange}
        />
      </Form.Group>          
    );
  }

  function renderInspections(): JSX.Element {
    return (
      <Form.Group>
        <Form.Label>Suoritukset tarkastukset</Form.Label>
        {[...Array(6)].map((item, index) => (
          <Row className="mb-1" key={index}>
            <Col><Form.Control placeholder={(index + 1) + '. työvaihe'} /></Col>
            <Col><Form.Control placeholder="tulos" /></Col>
          </Row>
        ))}
      </Form.Group>          
    );
  }

  function renderHistory(): JSX.Element {
    return (
      <Form.Group>
        <Form.Label>Korjaushistoria</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="history"
          value={description.history}
          onChange={onChange}
        />
      </Form.Group>          
    );
  }

  function renderText(): JSX.Element {
    return (
      <Form.Group>
        <Form.Label>Vapaa teksti</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="text"
          value={description.text}
          onChange={onChange}
        />
      </Form.Group>          
    );
  }

  const handleFill = () => {
    const newDescription = {...description}
    newDescription.description = 'Ei toimi';

    onFill(newDescription);
  }

  function renderTestButton(): JSX.Element {
    return <Button className="mr-2" variant="light" onClick={handleFill}>Testi</Button>
  }

  return (
    <>
      <QuestionSummary data={data} />
      <h3>Vian kuvaus</h3>
      <Form>
        {renderDescription()}
        {renderAppearance()}
        {renderDiagnostic()}
        {renderTester()}
        {renderInspections()}
        {renderHistory()}
        {renderText()}
      </Form>
      {TESTING && renderTestButton()}
    </>
  );
}

export default ComposeDescription;
