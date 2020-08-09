import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ProblemSummary from '../ProblemSummary'
import http from '../../../services/httpService';
import { LEON, GOLF, FOCUS } from './Cars';

function getFuelType(text: string): number {
  switch (text) {
    case 'bensiini': return 0;
    case 'diesel': return 1;
  }

  return 0;
}

interface Props {
  data: any,
  onData: (data: any) => void
}

const SearchData: React.FC<Props> = ({ data, onData }) => {
  const [error, setError] = useState('');

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

      const { data: info } = await http.get('/traficom/' + data.RegistrationNumber);

      const newData: any = {...data};

      newData.Make = info.carMake;
      newData.Model = info.carModel;
      newData.RegistrationYear = info.registrationYear;
      newData.RegistrationNumber = info.registrationNumber;
      newData.FuelType = getFuelType(info.fuelType);
      newData.EnginePower = info.power;
      newData.CylinderCount = info.cylinderCount;
      newData.EngineCode = info.engineCode;
      newData.EngineSize = info.engineSize;
      newData.VIN = info.vechileIdentificationNumber;
      newData.NetWeight = info.netWeight;
      newData.GrossWeight = info.grossWeight;
  
      onData(newData);
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404) {
        setError('Rekisterinumerolla ei löytynyt ajoneuvoa');
      }
    }
  }

  function renderFillButton(car: any): JSX.Element {
    return <Button className="mr-2" variant="light" onClick={() => handleFill(car)}>{car.Model}</Button>
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
        {renderFillButton(LEON)}
        {renderFillButton(GOLF)}
        {renderFillButton(FOCUS)}
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
      {isReady() && <ProblemSummary className="mt-3" data={data} />}
    </>
  );
}

export default SearchData;
