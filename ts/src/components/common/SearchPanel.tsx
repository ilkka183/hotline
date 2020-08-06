import React from 'react';
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { Field } from './Fields';
import FieldsTable from './FieldsTable';

interface Props {
  table: FieldsTable,
  onChange: () => void,
  onClear: () => void,
  onSearch: () => void
}

const SearchPanel: React.FC<Props> = ({ table, onChange, onClear, onSearch }) => {

  function renderTextInput(field: Field): JSX.Element {
    return (
      <Form.Group key={field.name} as={Row}>
        <Form.Label column sm="2">{field.label}</Form.Label>
        <Col sm="10">
          <Form.Control
            type="text"
            name={field.name}
            value={table.state.searchValues[field.name]}
            onChange={onChange}
          />
        </Col>
      </Form.Group>
    );
  }

  const fields = table.fields.filter(field => field.search);

  return (
    <Form className="mb-4" >
      {fields.map(field => renderTextInput(field))}
      <Row>
        <Col sm="2"></Col>
        <Col sm="10">
          <Button className="mr-2" onClick={onSearch}>Hae</Button>
          <Button onClick={onClear}>Tyhjennä</Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchPanel;
