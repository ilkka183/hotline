import React from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FieldSelect from './FieldSelect';
import Required from '../../../components/form/Required';
import { FUEL_TYPES } from './../ProblemsTable';
import http from '../../../services/httpService';

export default function SelectData({ data, onData, options, onOptions, onNext }) {

  const handleMakeChange = async ({ currentTarget: select }) => {
    const newData = {...data};
    newData[select.name] = select.value;
    newData.ModelYear = '';
    newData.FuelType = '';
    newData.Model = '';
    newData.EngineSize = '';

    onData(newData);

    const { data: items } = await http.get('/data/modelYears?make=' + newData.Make);

    const newOptions = {...options};
    newOptions.modelYears = items.map(value => ({ value, text: value }));

    onOptions(newOptions);
  }

  const handleModelYearChange = async ({ currentTarget: select }) => {
    const newData = {...data};
    newData[select.name] = select.value;
    newData.FuelType = '';
    newData.Model = '';
    newData.EngineSize = '';

    onData(newData);

    const { data: items } = await http.get(
      '/data/fuelTypes?make=' + newData.Make +
      '&modelYear=' + newData.ModelYear);

    const newOptions = {...options};
    newOptions.fuelTypes = items.map(value => ({ value, text: FUEL_TYPES[value] }));

    onOptions(newOptions);
  }

  const handleFuelTypeChange = async ({ currentTarget: select }) => {
    const newData = {...data};
    newData[select.name] = select.value;
    newData.Model = '';
    newData.EngineSize = '';

    onData(newData);

    const { data: items } = await http.get(
      '/data/models?make=' + newData.Make +
      '&modelYear=' + newData.ModelYear +
      '&fuelType=' + newData.FuelType);

    const newOptions = {...options};
    newOptions.models = items.map(value => ({ value, text: value }));

    onOptions(newOptions);
  }

  const handleModelChange = async ({ currentTarget: select }) => {
    const newData = {...data};
    newData[select.name] = select.value;
    newData.EngineSize = '';

    onData(newData);

    const { data: items } = await http.get(
      '/data/engineSizes?make=' + newData.Make +
      '&modelYear=' + newData.ModelYear +
      '&fuelType=' + newData.FuelType +
      '&model=' + newData.Model);

    const newOptions = {...options};
    newOptions.engineSizes = items.map(value => ({ value, text: value }));

    onOptions(newOptions);
  }

  const handleEngineSizeChange = async ({ currentTarget: select }) => {
    const newData = {...data};
    newData[select.name] = select.value;

    onData(newData);

    const { data: engineTypes } = await http.get(
      '/data/engineTypes?make=' + newData.Make +
      '&modelYear=' + newData.ModelYear +
      '&fuelType=' + newData.FuelType +
      '&model=' + newData.Model +
      '&engineSize=' + newData.EngineSize);

    const newOptions = {...options};
    newOptions.engineTypes = engineTypes;

    onOptions(newOptions);
  }

  const handleEngineTypeChange = async ({ currentTarget: radio }) => {
    const engine = options.engineTypes[radio.value];

    const newData = {...data};
    newData.EnginePower = engine.power;
    newData.EngineCode = engine.code;

    onData(newData);

    const newOptions = {...options};
    newOptions.engineType = parseInt(radio.value);

    onOptions(newOptions);
  }

  const handleInputChange = ({ currentTarget: input }) => {
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
    newData.EngineType = '';
    newData.EnginePower = '';
    newData.EngineCode = '';
    newData.VIN = '';
    newData.RegistrationNumber = '';

    onData(newData);
  }

  const handleSubmit = e => {
    e.preventDefault();

    onNext();
  }

  function formatEngineType(item) {
    let text = item.power + ' kW';
    
    if (item.code)
      text += ' (' + item.code + ')';

    return text;
  }

  function renderEngineTypes() {
    if (!options.engineTypes)
      return null;

    return options.engineTypes.map((item, index) => (
      <Form.Check
        type="radio"
        label={formatEngineType(item)}
        key={index}
        value={index}
        checked={options.engineType === index}
        onChange={handleEngineTypeChange}
      />
    ));
  }

  function renderVIN() {
    return (
      <Form.Group controlId="VIN">
        <Form.Label>VIN <Required /></Form.Label>
        <Form.Control
          name="VIN"
          value={data.VIN}
          onChange={handleInputChange}
        />
      </Form.Group>        
    );
  }

  function renderRegistrationNumber() {
    return (
      <Form.Group controlId="RegistrationNumber">
        <Form.Label>Rekisterinumero</Form.Label>
        <Form.Control
          name="RegistrationNumber"
          value={data.RegistrationNumber}
          onChange={handleInputChange}
        />
      </Form.Group>        
    );
  }

  function renderMakes() {
    return (
      <FieldSelect
        name="Make"
        placeholder="Valitse merkki"
        value={data.Make}
        options={options.makes}
        onChange={handleMakeChange}
      />
    );
  }

  function renderModelYears() {
    return (
      <FieldSelect
        name="ModelYear"
        placeholder="Valitse mallivuosi"
        value={data.ModelYear}
        options={options.modelYears}
        onChange={handleModelYearChange}
      />
    );
  }

  function renderFuelTypes() {
    return (
      <FieldSelect
        name="FuelType"
        placeholder="Valitse käyttövoima"
        value={data.FuelType}
        options={options.fuelTypes}
        onChange={handleFuelTypeChange}
      />
    );
  }

  function renderModels() {
    return (
      <FieldSelect
        name="Model"
        placeholder="Valitse malli"
        value={data.Model}
        options={options.models}
        onChange={handleModelChange}
      />
    );
  }

  function renderEngineSizes() {
    return (
      <FieldSelect
        name="EngineSize"
        placeholder="Valitse kuutiotilavuus"
        value={data.EngineSize}
        options={options.engineSizes}
        onChange={handleEngineSizeChange}
      />
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h5>Valitse ajoneuvon tiedot</h5>
      {renderMakes()}
      {data.Make && renderModelYears()}
      {data.ModelYear && renderFuelTypes()}
      {data.FuelType && renderModels()}
      {data.Model && renderEngineSizes()}
      {data.EngineSize && renderEngineTypes()}
      {data.EngineSize && renderVIN()}
      {data.EngineSize && renderRegistrationNumber()}
      <Button className="mr-2" disabled={!data.Make} onClick={handleClear}>Tyhjennä</Button>
    </Form>
  );
}