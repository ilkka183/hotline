import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FieldSelect from './FieldSelect';
import { FUEL_TYPES } from './ProblemsTable';
import http from '../../services/httpService';


export default class SelectVehicleForm extends Component {
  state = {
    data: {
      make: '',
      modelYear: '',
      fuelType: '',
      model: '',
      engineSize: ''
    }
  }

  handleChange = ({ currentTarget: select }) => {
    const data = {...this.state.data};
    data[select.name] = select.value;

    if (['make'].includes(select.name))
      data.modelYear = '';

    if (['make', 'modelYear'].includes(select.name))
      data.fuelType = '';

    if (['make', 'modelYear', 'fuelType'].includes(select.name))
      data.model = '';

    if (['make', 'modelYear', 'fuelType', 'model'].includes(select.name))
      data.engineSize = '';

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
    data.fuelType = FUEL_TYPES.indexOf(data.fuelType);

    console.log(data);

    this.props.onSelected(data);
  }

  getMakes = async () => {
    console.log(this.state);

    const { data } = await http.get('/data/makes');
    return data
  }

   getModelYears = async () => {
    const { data } = await http.get('/data/modelYears?make=' + this.state.data.make);
    return data
  }

  getFuelTypes = async () => {
    const { data } = await http.get('/data/fuelTypes?make=' + this.state.data.make);
    return data
  }

  getModels = async () => {
    const { data } = await http.get('/data/models?make=' + this.state.data.make);
    return data
  }

  getEngineSizes = async () => {
    const { data } = await http.get('/data/engineSizes?make=' + this.state.data.make);
    return data
  }

  render() {
    const { make, modelYear, fuelType, model, engineSize } = this.state.data;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FieldSelect name="make" placeholder="Valitse merkki" value={make} getValues={this.getMakes} onChange={this.handleChange} />
        {make && <FieldSelect name="modelYear" placeholder="Valitse mallivuosi" value={modelYear} getValues={this.getModelYears} onChange={this.handleChange} />}
        {modelYear && <FieldSelect name="fuelType" placeholder="Valitse käyttövoima" value={fuelType} getValues={this.getFuelTypes} onChange={this.handleChange} />}
        {fuelType && <FieldSelect name="model" placeholder="Valitse malli" value={model} getValues={this.getModels} onChange={this.handleChange} />}
        {model && <FieldSelect name="engineSize" placeholder="Valitse moottorin koko" value={engineSize} getValues={this.getEngineSizes} onChange={this.handleChange} />}
        <Button className="mb-2 mr-sm-2" type="submit" disabled={!engineSize}>Jatka</Button>
        <Button className="mb-2 mr-sm-2" disabled={!make} onClick={this.handleClear}>Tyhjennä</Button>
      </Form>
    );
  }
}
