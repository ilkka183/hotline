import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import LicenseNumberForm from './LicenseNumber'
import SelectVehicleForm from './SelectVehicle'

export default class NewProblemForm extends Component {
  handleSubmit = e => {
    e.preventDefault();

    this.props.history.goBack();
  }

  render() { 
    return (
      <Container>
        <h2>Lisää uusi vikatapaus</h2>
        <Tabs className="mb-2" variant="pills" defaultActiveKey="home" id="uncontrolled-tab-example">
          <Tab eventKey="home" title="Hae rekisterinumerolla">
          </Tab>
          <Tab eventKey="profile" title="Ohjattu syöttö">
          </Tab>
          <Tab eventKey="contact" title="Manuaalinen syöttö">
          </Tab>
        </Tabs>
        <LicenseNumberForm />
        <SelectVehicleForm />
      </Container>
    );
  }
}
