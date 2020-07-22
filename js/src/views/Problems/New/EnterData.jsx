import React from 'react';
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { FUEL_TYPES } from './../ProblemsTable';
import { LEON, GOLF, FOCUS } from './Cars';

export default function EnterData({ data, onData, onNext }) {

  const handleChange = ({ currentTarget: input }) => {
    const newData = {...data};

    newData[input.name] = input.value;

    onData(newData);
  }

  const handleClear = () => {
    const newData = {...data};

    newData.Make = '';
    newData.Model = '';
    newData.ModelYear = '';
    newData.FuelType = '';
    newData.EngineSize = '';
    newData.EnginePower = '';
    newData.EngineCode = '';
    newData.VIN = '';
    newData.RegistrationNumber = '';

    onData(newData);
  }

  const handleFill = (car) => {
    const newData = {...data};

    for (const name in car)
      newData[name] = car[name];

    onData(newData);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    onNext();
  }

  function renderInputText(name, label) {
    return (
      <Form.Group as={Row}>
        <Form.Label column sm="2">{label}</Form.Label>
        <Col sm="10">
          <Form.Control name={name} value={data[name]} onChange={handleChange} />
        </Col>
      </Form.Group>
    );
  }

  function renderSelectEnum(name, label, enums) {
    const options = [{ value: null, text: '' }, ...enums.map((text, value) => ({ value, text }))];

    return (
      <Form.Group as={Row}>
        <Form.Label column sm="2">{label}</Form.Label>
        <Col sm="10">
          <Form.Control
            as="select"
            name={name}
            value={data[name]}
            onChange={handleChange}
          >
            {options.map(option => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.text}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Form.Group>
    );
  }

  function renderFillButton(car) {
    return <Button className="mr-2" variant="light" onClick={() => handleFill(car)}>{car.Model}</Button>
  }

  function isReady() {
    return data.Make && data.Model && data.ModelYear;
  }

  return (
    <>
      <h4>Syötä ajoneuvon tiedot</h4>
      <Form onSubmit={handleSubmit}>
        {renderInputText('Make', 'Merkki')}
        {renderInputText('Model', 'Malli')}
        {renderInputText('ModelYear', 'Mallivuosi')}
        {renderSelectEnum('FuelType', 'Käyttövoima', FUEL_TYPES)}
        {renderInputText('EngineSize', 'Kuutiotilavuus')}
        {renderInputText('EnginePower', 'Teho (kW)')}
        {renderInputText('EngineCode', 'Moottorin tunnus')}
        {renderInputText('VIN', 'VIN')}
        {renderInputText('RegistrationNumber', 'Rekisterinumero')}
        <Button className="mr-2" disabled={!isReady()} onClick={handleClear}>Tyhjennä</Button>
        <Button className="mr-2" type="submit" disabled={!isReady()}>Seuraava</Button>
        {renderFillButton(LEON)}
        {renderFillButton(GOLF)}
        {renderFillButton(FOCUS)}
      </Form>
    </>
  );
}
