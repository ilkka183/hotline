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

  function renderText(field: Field): JSX.Element {
    const searchValues: any = table.state.searchValues;

    return (
      <Form.Control
        type="text"
        name={field.name}
        value={searchValues[field.name]}
        onChange={onChange}
      />
    );
  }

  function renderEnums(field: Field): JSX.Element {
    const searchValues: any = table.state.searchValues;

    return (
      <Form.Control as="select" defaultValue={searchValues[field.name]} onChange={onChange}>
        <option></option>
        {field.enums && field.enums.map((text: string, index: number) => <option value={index}>{text}</option>)}
      </Form.Control>
    );
  }

  function renderBoolean(field: Field): JSX.Element {
    const searchValues: any = table.state.searchValues;

    return (
      <Form.Control as="select" defaultValue={searchValues[field.name]} onChange={onChange}>
        <option></option>
        <option value={0}>Kyllä</option>
        <option value={1}>Ei</option>
      </Form.Control>
    );
  }

  function renderControl(field: any): JSX.Element {
    if (field.type === 'boolean')
      return renderBoolean(field);

    if (field.enums)
      return renderEnums(field);

    return renderText(field);
  }

  function renderField(field: any): JSX.Element {
    return (
      <Form.Group key={field.name} as={Row}>
        <Form.Label column sm="2">{field.label}</Form.Label>
        <Col sm="10">{renderControl(field)}</Col>
      </Form.Group>
    );
  }

  const fields: Field[] = table.fields.filter((field: any) => field.search);

  return (
    <Form className="mb-4" >
      {fields.map((field: any) => renderField(field))}
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
