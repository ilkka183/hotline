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

  function renderText(field: Field, searchValues: any): JSX.Element {
    return (
      <Form.Control
        type="text"
        name={field.name}
        value={searchValues[field.name]}
        onChange={onChange}
      />
    );
  }

  function renderSelect(field: Field, options: object[], searchValues: any): JSX.Element {
    return (
      <Form.Control
        as="select"
        name={field.name}
        value={searchValues[field.name]}
        onChange={onChange}
      >
        <option></option>
        {options.map((item: any) => <option key={item.value} value={item.value}>{item.text}</option>)}
      </Form.Control>
    );
  }

  function renderEnums(field: Field, searchValues: any): JSX.Element {
    let options: object[] = [];
    
    if (field.enums)
      options = field.enums.map((text: string, value: number) => { return { value, text }});

    return renderSelect(field, options, searchValues);
  }

  function renderBoolean(field: Field, searchValues: any): JSX.Element {
    const options = [
      { value: 0, text: 'Ei'},
      { value: 1, text: 'Kyllä'}
    ];

    return renderSelect(field, options, searchValues);
  }

  function renderControl(field: any): JSX.Element {
    const searchValues: any = table.state.searchValues;

    if (field.type === 'boolean')
      return renderBoolean(field, searchValues);

    if (field.enums)
      return renderEnums(field, searchValues);

    return renderText(field, searchValues);
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
