import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import RegistrationNumber from './RegistrationNumber'
import SelectData from './SelectData'
import EditData from './EditData'
import auth from '../../services/authService';

function getFuel(text) {
  switch (text) {
    case 'bensiini': return 0;
    case 'diesel': return 1;
    default: return 0;
  }
}

export default class NewProblemForm extends Component {
  state = {
    registrationNumber: '',
    data: null
  }

  handleRegistrationNumberSearch = (info) => {
    this.setState({ data: null });

    console.log(info);

    const data = {
      userId: auth.getCurrentUser().id,
      brand: info.carMake,
      model: info.carModel,
      modelYear: info.registrationYear,
      registrationNumber: info.registrationNumber,
      fuel: getFuel(info.fuelType),
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

  handleSubmit = e => {
    this.props.history.goBack();
  }

  render() { 
    return (
      <Container>
        <h2>Lisää uusi vikatapaus</h2>
        <Tabs className="mb-2" variant="pills" defaultActiveKey="home" id="uncontrolled-tab-example">
          <Tab eventKey="home" title="Hae rekisterinumerolla">
            <RegistrationNumber onSearch={this.handleRegistrationNumberSearch} onClear={this.handleRegistrationNumberClear} />
          </Tab>
          <Tab eventKey="profile" title="Ohjattu syöttö">
            <SelectData />
          </Tab>
          <Tab eventKey="contact" title="Manuaalinen syöttö">
          </Tab>
        </Tabs>
        {this.state.data && <EditData data={this.state.data} onSubmit={this.handleSubmit}/>}
      </Container>
    );
  }
}
