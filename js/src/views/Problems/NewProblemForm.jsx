import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import RegistrationNumber from './RegistrationNumber'
import SelectData from './SelectData'
import EditData from './EditData'
import auth from '../../services/authService';

function getFuelType(text) {
  switch (text) {
    case 'bensiini': return 0;
    case 'diesel': return 1;
    default: return 0;
  }
}

export default class NewProblemForm extends Component {
  state = {
    data: null
  }

  handleSelect = (eventKey) => {
    this.setState({ data: null });

    let data = null;

    if (eventKey === 'manual') {
      data = {
        userId: auth.getCurrentUser().id,
        make: '',
        model: '',
        modelYear: '',
        registrationYear: '',
        registrationNumber: '',
        fuelType: '',
        power: '',
        cylinderCount: '',
        engineCode: '',
        engineSize: '',
        vin: '',
        netWeight: '',
        grossWeight: ''
      }
    }

    this.setState({ data });
  }

  handleRegistrationNumberSearch = (info) => {
    this.setState({ data: null });

    console.log(info);

    const data = {
      userId: auth.getCurrentUser().id,
      make: info.carMake,
      model: info.carModel,
      registrationYear: info.registrationYear,
      registrationNumber: info.registrationNumber,
      fuelType: getFuelType(info.fuelType),
      power: info.power,
      cylinderCount: info.cylinderCount,
      engineCode: info.engineCode,
      engineSize: info.engineSize,
      vin: info.vechileIdentificationNumber,
      netWeight: info.netWeight,
      grossWeight: info.grossWeight
    }

    this.setState({ data });

    console.log(data);
  }

  handleRegistrationNumberClear = () => {
    this.setState({ data: null });
  }

  handleSelectionSelected = (info) => {
    this.setState({ data: null });

    const data = {
      userId: auth.getCurrentUser().id,
      ...info
    }

    this.setState({ data });

    console.log(data);
  }

  handleSubmit = e => {
    this.props.history.goBack();
  }

  render() { 
    return (
      <Container>
        <h2>Lisää uusi vikatapaus</h2>
        <Tabs className="mb-2" variant="pills" defaultActiveKey="home" id="uncontrolled-tab-example" onSelect={this.handleSelect}>
          <Tab eventKey="search" title="Hae rekisterinumerolla">
            <RegistrationNumber onSearch={this.handleRegistrationNumberSearch} onClear={this.handleRegistrationNumberClear} />
          </Tab>
          <Tab eventKey="select" title="Ohjattu syöttö">
            <SelectData onSelected={this.handleSelectionSelected} />
          </Tab>
          <Tab eventKey="manual" title="Manuaalinen syöttö">
          </Tab>
        </Tabs>
        {this.state.data && <EditData data={this.state.data} onSubmit={this.handleSubmit}/>}
      </Container>
    );
  }
}
