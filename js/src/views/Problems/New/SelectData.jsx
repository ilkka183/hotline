import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FieldSelect from './FieldSelect';
import { FUEL_TYPES } from './../ProblemsTable';
import http from '../../../services/httpService';


export default class SelectVehicleForm extends Component {
  state = {
    selections: {
      make: '',
      modelYear: '',
      fuelType: '',
      model: '',
      engineSize: '',
      enginePower: '',
      engineCode: ''
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
    const selections = {...this.state.selections};
    selections[select.name] = select.value;
    selections.modelYear = '';
    selections.fuelType = '';
    selections.model = '';
    selections.engineSize = '';

    const { data } = await http.get('/data/modelYears?make=' + select.value);
    const modelYears = data.map(value => ({ value, text: value }));

    this.setState({ selections, modelYears });
  }

  handleModelYearChange = async ({ currentTarget: select }) => {
    const selections = {...this.state.selections};
    selections[select.name] = select.value;
    selections.fuelType = '';
    selections.model = '';
    selections.engineSize = '';

    const { make } = this.state.selections;

    const { data } = await http.get('/data/fuelTypes?make=' + make + '&modelYear=' + select.value);
    const fuelTypes = data.map(value => ({ value, text: FUEL_TYPES[value] }));

    this.setState({ selections, fuelTypes });
  }

  handleFuelTypeChange = async ({ currentTarget: select }) => {
    const selections = {...this.state.selections};
    selections[select.name] = select.value;
    selections.model = '';
    selections.engineSize = '';

    const { make, modelYear } = this.state.selections;

    const { data } = await http.get('/data/models?make=' + make + '&modelYear=' + modelYear + '&fuelType=' + select.value);
    const models = data.map(value => ({ value, text: value }));

    this.setState({ selections, models });
  }

  handleModelChange = async ({ currentTarget: select }) => {
    const selections = {...this.state.selections};
    selections[select.name] = select.value;
    selections.engineSize = '';

    const { make, modelYear, fuelType } = this.state.selections;

    const { data } = await http.get('/data/engineSizes?make=' + make + '&modelYear=' + modelYear + '&fuelType=' + fuelType + '&model=' + select.value);
    const engineSizes = data.map(value => ({ value, text: value }));

    this.setState({ selections, engineSizes });
  }

  handleEngineSizeChange = async ({ currentTarget: select }) => {
    const selections = {...this.state.selections};
    selections[select.name] = select.value;

    const { make, modelYear, fuelType, model } = this.state.selections;

    const { data: engineTypes } = await http.get('/data/engineTypes?make=' + make + '&modelYear=' + modelYear + '&fuelType=' + fuelType + '&model=' + model + '&engineSize=' + select.value);

    this.setState({ selections, engineTypes });
  }

  handleEngineTypeChange = async ({ currentTarget: radio }) => {
    const engine = this.state.engineTypes[radio.value];

    const engineType = parseInt(radio.value);

    const selections = {...this.state.selections};
    selections.enginePower = engine.power;
    selections.engineCode = engine.code;

    this.setState({ selections, engineType });

    console.log(this.state.selections);
  }

  handleClear = () => {
    const selections = {...this.state.selections};

    for (const name in selections)
      selections[name] = '';

    this.setState({ selections });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { selections } = this.state;
    console.log(selections);

    this.props.onSelected(selections);
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

  render() {
    const { make, modelYear, fuelType, model, engineSize, enginePower, engineCode } = this.state.selections;
    const { makes, modelYears, fuelTypes, models, engineSizes } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FieldSelect name="make" placeholder="Valitse merkki" value={make} options={makes} onChange={this.handleMakeChange} />
        {make && <FieldSelect name="modelYear" placeholder="Valitse mallivuosi" value={modelYear} options={modelYears} onChange={this.handleModelYearChange} />}
        {modelYear && <FieldSelect name="fuelType" placeholder="Valitse käyttövoima" value={fuelType} options={fuelTypes} onChange={this.handleFuelTypeChange} />}
        {fuelType && <FieldSelect name="model" placeholder="Valitse malli" value={model} options={models} onChange={this.handleModelChange} />}
        {model && <FieldSelect name="engineSize" placeholder="Valitse moottorin koko" value={engineSize} options={engineSizes} onChange={this.handleEngineSizeChange} />}
        {engineSize && this.renderEngineTypes()}
        <Button className="mb-2 mr-sm-2" type="submit" disabled={!(enginePower || engineCode)}>Jatka</Button>
        <Button className="mb-2 mr-sm-2" disabled={!make} onClick={this.handleClear}>Tyhjennä</Button>
      </Form>
    );
  }
}
