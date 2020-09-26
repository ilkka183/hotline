import React from 'react';
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { FUEL_TYPE_TEXTS } from './../Question';
import { LEON, GOLF, FOCUS } from './Cars';

interface Props {
  data: any,
  onData: (data: any) => void,
  onNext?: () => void
}

const EnterData: React.FC<Props> = ({ data, onData, onNext }) => {

  const handleChange = ({ currentTarget: input }: any) => {
    const newData: any = {...data};

    newData[input.name] = input.value;

    onData(newData);
  }

  const handleClear = () => {
    const newData: any = {...data};

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

  const handleFill = (car: any) => {
    const newData: any = {...data};

    for (const name in car)
      newData[name] = car[name];

    onData(newData);
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (onNext)
      onNext();
  }

  function renderInputText(name: string, label: string): JSX.Element {
    return (
      <Form.Group as={Row}>
        <Form.Label column sm="2">{label}</Form.Label>
        <Col sm="10">
          <Form.Control name={name} value={data[name]} onChange={handleChange} />
        </Col>
      </Form.Group>
    );
  }

  function renderSelectEnum(name: string, label: string, enums: string[]): JSX.Element {
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
            {options.map((option: any) => (
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

  function renderFillButton(car: any): JSX.Element {
    return <Button className="mr-2" variant="light" onClick={() => handleFill(car)}>{car.Model}</Button>
  }

  function isNull(): boolean {
    return !data.Make && !data.Model && !data.ModelYear;
  }

  return (
    <>
      <h5>Syötä ajoneuvon tiedot</h5>
      <Form onSubmit={handleSubmit}>
        {renderInputText('Make', 'Merkki')}
        {renderInputText('Model', 'Malli')}
        {renderInputText('ModelYear', 'Mallivuosi')}
        {renderSelectEnum('FuelType', 'Käyttövoima', FUEL_TYPE_TEXTS)}
        {renderInputText('EngineSize', 'Kuutiotilavuus')}
        {renderInputText('EnginePower', 'Teho (kW)')}
        {renderInputText('EngineCode', 'Moottorin tunnus')}
        {renderInputText('VIN', 'VIN')}
        {renderInputText('RegistrationNumber', 'Rekisterinumero')}
        <Button className="mr-2" disabled={isNull()} onClick={handleClear}>Tyhjennä</Button>
        {renderFillButton(LEON)}
        {renderFillButton(GOLF)}
        {renderFillButton(FOCUS)}
      </Form>
    </>
  );
}

export default EnterData;
