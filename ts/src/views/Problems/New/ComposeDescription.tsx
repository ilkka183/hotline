import React from 'react';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import ProblemSummary from '../ProblemSummary'
import Required from '../../../components/form/Required';

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

export default function ComposeDescription({ data, description, onChange, onChangeCheckboxGroup }) {

  function renderDescription() {
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

  function renderAppearance() {
    return (
      <Form.Group>
      <Form.Label>Vian ensiintyminen</Form.Label>
        {APPEARANCES.map((item, index) => (
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

  function renderDiagnostic() {
    return (
      <Form.Group>
      <Form.Label>Itsediagnostiikka</Form.Label>
        {DIAGNOSTIC.map((item, index) => (
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

  function renderTester() {
    return (
      <Form.Group>
        <Form.Label>Käytetyt testilaitteet</Form.Label>
        {TESTERS.map((item, index) => (
          <Form.Check
            type="checkbox"
            name="testers"
            id={index + 1}
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

  function renderInspections() {
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

  function renderHistory() {
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

  function renderText() {
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

  return (
    <>
      <ProblemSummary data={data} />
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
    </>
  );
}