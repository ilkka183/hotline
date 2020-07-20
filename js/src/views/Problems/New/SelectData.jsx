import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FieldSelect from './FieldSelect';
import { FUEL_TYPES } from './../ProblemsTable';
import http from '../../../services/httpService';


export default class SelectVehicleForm extends Component {
  state = {
    data: {
      make: '',
      modelYear: '',
      fuelType: '',
      model: '',
      engineSize: '',
      enginePower: '',
      engineCode: '',
      vin: '',
      registrationNumber: ''
    },
    engineType: null,
    makes: null,
    modelYears: null,
    fuelTypes: null,
    models: null,
    engineSizes: null,
    engineTypes: null
  }

  async componentDidMount() {
    const { data } = await http.get('/data/makes');
    const makes = data.map(value => ({ value, text: value }));

    this.setState({ makes });
  }

  handleMakeChange = async ({ currentTarget: select }) => {
    const data = {...this.state.data};
    data[select.name] = select.value;
    data.modelYear = '';
    data.fuelType = '';
    data.model = '';
    data.engineSize = '';

    const { data: items } = await http.get('/data/modelYears?make=' + select.value);
    const modelYears = items.map(value => ({ value, text: value }));

    this.setState({ data, modelYears });
  }

  handleModelYearChange = async ({ currentTarget: select }) => {
    const data = {...this.state.data};
    data[select.name] = select.value;
    data.fuelType = '';
    data.model = '';
    data.engineSize = '';

    const { make } = this.state.data;

    const { data: items } = await http.get('/data/fuelTypes?make=' + make + '&modelYear=' + select.value);
    const fuelTypes = items.map(value => ({ value, text: FUEL_TYPES[value] }));

    this.setState({ data, fuelTypes });
  }

  handleFuelTypeChange = async ({ currentTarget: select }) => {
    const data = {...this.state.data};
    data[select.name] = select.value;
    data.model = '';
    data.engineSize = '';

    const { make, modelYear } = this.state.data;

    const { data: items } = await http.get('/data/models?make=' + make + '&modelYear=' + modelYear + '&fuelType=' + select.value);
    const models = items.map(value => ({ value, text: value }));

    this.setState({ data, models });
  }

  handleModelChange = async ({ currentTarget: select }) => {
    const data = {...this.state.data};
    data[select.name] = select.value;
    data.engineSize = '';

    const { make, modelYear, fuelType } = this.state.data;

    const { data: items } = await http.get('/data/engineSizes?make=' + make + '&modelYear=' + modelYear + '&fuelType=' + fuelType + '&model=' + select.value);
    const engineSizes = items.map(value => ({ value, text: value }));

    this.setState({ data, engineSizes });
  }

  handleEngineSizeChange = async ({ currentTarget: select }) => {
    const data = {...this.state.data};
    data[select.name] = select.value;

    const { make, modelYear, fuelType, model } = this.state.data;

    const { data: engineTypes } = await http.get('/data/engineTypes?make=' + make + '&modelYear=' + modelYear + '&fuelType=' + fuelType + '&model=' + model + '&engineSize=' + select.value);

    this.setState({ data, engineTypes });
  }

  handleEngineTypeChange = async ({ currentTarget: radio }) => {
    const engine = this.state.engineTypes[radio.value];

    const engineType = parseInt(radio.value);

    const data = {...this.state.data};
    data.enginePower = engine.power;
    data.engineCode = engine.code;

    this.setState({ data, engineType });

    console.log(this.state.data);
  }

  handleInputChange = ({ currentTarget: input }) => {
    const data = {...this.state.data}

    data[input.name] = input.value;

    this.setState({ data });
  }

  handleClear = () => {
    const data = {...this.state.data};

    for (const name in data)
    data[name] = '';

    this.setState({ data });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { data } = this.state;
    console.log(data);

    this.props.onSelected(data);
  }

  formatEngineType(item) {
    let text = item.power + ' kW';
    
    if (item.code)
      text += ' (' + item.code + ')';

    return text;
  }

  renderEngineTypes() {
    const { engineType, engineTypes } = this.state;

    return engineTypes.map((item, index) => (
      <Form.Check
        type="radio"
        label={this.formatEngineType(item)}
        key={index}
        value={index}
        checked={engineType === index}
        onChange={this.handleEngineTypeChange}
      />
    ));
  }

  renderVIN() {
    const { vin } = this.state.data;

    return (
      <Form.Group controlId="VIN">
        <Form.Label>VIN< span className="required">*</span></Form.Label>
        <Form.Control
          name="vin"
          value={vin}
          onChange={this.handleInputChange}
        />
      </Form.Group>        
    );
  }

  renderRegistrationNumber() {
    const { registrationNumber } = this.state.data;

    return (
      <Form.Group controlId="RegistrationNumber">
        <Form.Label>Rekisterinumero</Form.Label>
        <Form.Control
          name="registrationNumber"
          value={registrationNumber}
          onChange={this.handleInputChange}
        />
      </Form.Group>        
    );
  }

  render() {
    const { make, modelYear, fuelType, model, engineSize, enginePower, engineCode, vin } = this.state.data;
    const { makes, modelYears, fuelTypes, models, engineSizes } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FieldSelect name="make" placeholder="Valitse merkki" value={make} options={makes} onChange={this.handleMakeChange} />
        {make && <FieldSelect name="modelYear" placeholder="Valitse mallivuosi" value={modelYear} options={modelYears} onChange={this.handleModelYearChange} />}
        {modelYear && <FieldSelect name="fuelType" placeholder="Valitse käyttövoima" value={fuelType} options={fuelTypes} onChange={this.handleFuelTypeChange} />}
        {fuelType && <FieldSelect name="model" placeholder="Valitse malli" value={model} options={models} onChange={this.handleModelChange} />}
        {model && <FieldSelect name="engineSize" placeholder="Valitse moottorin koko" value={engineSize} options={engineSizes} onChange={this.handleEngineSizeChange} />}
        {engineSize && this.renderEngineTypes()}
        {engineSize && this.renderVIN()}
        {engineSize && this.renderRegistrationNumber()}
        <Button className="mb-2 mr-sm-2" type="submit" disabled={!(enginePower || engineCode) || !vin}>Jatka</Button>
        <Button className="mb-2 mr-sm-2" disabled={!make} onClick={this.handleClear}>Tyhjennä</Button>
      </Form>
    );
  }
}
