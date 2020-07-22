import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import DataInfo from './DataInfo'
import http from '../../../services/httpService';
import { LEON, GOLF, FOCUS } from './Cars';

function getFuelType(text) {
  switch (text) {
    case 'bensiini': return 0;
    case 'diesel': return 1;
    default: return 0;
  }
}

export default function SearchData({ data, onData, onNext }) {
  const [error, setError] = useState('');

  const handleChange = ({ currentTarget: input }) => {
    const newData = {...data};

    newData.RegistrationNumber = input.value;

    onData(newData);
  }

  const handleClear = () => {
    setError('');

    const newData = {...data};

    newData.Make = '';
    newData.RegistrationNumber = '';

    onData(newData);
  }

  const handleFill = (car) => {
    setError('');

    const newData = {...data};

    newData.RegistrationNumber = car.RegistrationNumber;

    onData(newData);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');

      const { data: info } = await http.get('/traficom/' + data.RegistrationNumber);

      const newData = {...data};

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

  function isReady() {
    return data.RegistrationNumber && data.Make && !error;
  }

  return (
    <>
      <h4>Hae ajoneuvon tiedot rekisterinumerolla</h4>
      <Form inline onSubmit={handleSubmit}>
        <Form.Control
          className="mr-2"
          placeholder="Rekisterinumero"
          value={data.RegistrationNumber}
          onChange={handleChange}

        />          
        <Button className="mr-2" type="submit" disabled={!data.RegistrationNumber}>Hae</Button>
        <Button className="mr-2" disabled={!data.RegistrationNumber} onClick={handleClear}>Tyhjennä</Button>
        <Button className="mr-2" variant="light" onClick={() => handleFill(LEON)}>Leon</Button>
        <Button className="mr-2" variant="light" onClick={() => handleFill(GOLF)}>Golf</Button>
        <Button className="mr-2" variant="light" onClick={() => handleFill(FOCUS)}>Focus</Button>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}
      {isReady() && <DataInfo className="mt-2" data={data} />}
      {isReady() && <Button onClick={onNext}>Seuraava</Button>}
    </>
  );
}
