import React from 'react';
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { Field } from './Fields';

interface Props {
  table: any,
  newButtonText?: string,
  onChange: (event: any) => void,
  onClear: () => void,
  onNew: () => void,
  onSearch: () => void
}

const SearchPanel: React.FC<Props> = ({ table, newButtonText, onChange, onClear, onNew, onSearch }) => {

  function renderTextInput(field: Field): JSX.Element {
    const searchValues: any = table.state.searchValues;

    return (
      <Form.Group key={field.name} as={Row}>
        <Form.Label column sm="2">{field.label}</Form.Label>
        <Col sm="10">
          <Form.Control
            type="text"
            name={field.name}
            value={searchValues[field.name]}
            onChange={onChange}
          />
        </Col>
      </Form.Group>
    );
  }

  const fields: Field[] = table.fields.filter((field: any) => field.search);

  return (
    <Form className="mb-4" >
      {fields.map((field: any) => renderTextInput(field))}
      <Row>
        <Col sm="2"></Col>
        <Col sm="10">
          <Button className="mr-2" onClick={onSearch}>Hae</Button>
          <Button className="mr-2" onClick={onClear}>Tyhjennä</Button>
          <Button variant="success" onClick={onNew}>{newButtonText ? newButtonText : 'Lisää uusi'}</Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchPanel;
