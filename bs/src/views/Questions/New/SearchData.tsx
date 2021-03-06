import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import QuestionSummary from '../QuestionSummary'
import http from '../../../services/httpService';
import { LEON, GOLF, FOCUS } from './Cars';
import { TESTING } from '../Questions';
import { FuelType } from '../Question';

function valueOf(value: any): any {
  return value ? value : '';
}

function fuelTypeOf(text: string): FuelType {
  switch (text.toLowerCase()) {
    case 'bensiini': return FuelType.Petrol;
    case 'diesel': return FuelType.Diesel;
  }

  return 0;
}

interface Props {
  data: any,
  onData: (data: any) => void
}

const SearchData: React.FC<Props> = ({ data, onData }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = ({ currentTarget: input }: any) => {
    const newData: any = {...data};

    newData.RegistrationNumber = input.value;

    onData(newData);
  }

  const handleClear = () => {
    setError('');

    const newData: any = {...data};

    newData.Make = '';
    newData.RegistrationNumber = '';

    onData(newData);
  }

  const handleFill = (car: any) => {
    setError('');

    const newData: any = {...data};

    newData.RegistrationNumber = car.RegistrationNumber;

    onData(newData);
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      setError('');
      setLoading(true);

      const { data: info } = await http.get('/traficom/' + data.RegistrationNumber + '?source=BovSoftApi');

      const newData: any = {...data};

      newData.Make = valueOf(info.carMake);
      newData.Model = valueOf(info.carModel);
      newData.RegistrationYear = valueOf(info.registrationYear);
      newData.RegistrationNumber = valueOf(info.registrationNumber);
      newData.FuelType = fuelTypeOf(info.fuelType);
      newData.EnginePower = valueOf(info.power);
      newData.CylinderCount = valueOf(info.cylinderCount);
      newData.EngineCode = valueOf(info.engineCode);
      newData.EngineSize = valueOf(info.engineSize);
      newData.VIN = valueOf(info.vin);
      newData.KType = valueOf(info.ktype);
      newData.NetWeight = valueOf(info.netWeight);
      newData.GrossWeight = valueOf(info.grossWeight);
  
      setLoading(false);

      onData(newData);
    }
    catch (ex) {
      setLoading(false);

      if (ex.response && ex.response.status === 404) {
        setError('Rekisterinumerolla ' + data.RegistrationNumber + ' ei löytynyt ajoneuvoa!');
      }
    }
  }

  function renderFillButton(car: any): JSX.Element {
    return <Button className="mr-2" variant="light" onClick={() => handleFill(car)}>{car.Model}</Button>
  }

  function renderTestButtons(): JSX.Element {
    return (
      <>
        {renderFillButton(LEON)}
        {renderFillButton(GOLF)}
        {renderFillButton(FOCUS)}
      </>
    );
  }

  function isNull(): boolean {
    return !data.RegistrationNumber;
  }

  function isReady(): boolean {
    return data.RegistrationNumber && data.Make && !error;
  }

  return (
    <>
      <h5>Hae ajoneuvon tiedot rekisterinumerolla</h5>
      <Form inline onSubmit={handleSubmit}>
        <Form.Control
          className="mr-2"
          placeholder="Rekisterinumero"
          value={data.RegistrationNumber}
          onChange={handleChange}
        />
        <Button className="mr-2" type="submit" disabled={!data.RegistrationNumber}>Hae</Button>
        <Button className="mr-2" disabled={isNull()} onClick={handleClear}>Tyhjennä</Button>
        {TESTING && renderTestButtons()}
        {loading && <Spinner animation="border" />}
      </Form>
      {error && <Alert className="mt-2" variant="danger">{error}</Alert>}
      {isReady() && <QuestionSummary className="mt-3" data={data} />}
    </>
  );
}

export default SearchData;
