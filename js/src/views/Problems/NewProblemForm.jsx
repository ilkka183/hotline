import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import RegistrationNumber from './RegistrationNumber'
import SelectData from './SelectData'
import EditData from './EditData'

export default class NewProblemForm extends Component {
  state = {
    registrationNumber: '',
    brand: '',
    model: ''
  }
  
  handleRegistrationNumber = (data) => {
    console.log(data);

    const state = {
      registrationNumber: data.registrationNumber,
      brand: data.carMake,
      model: data.carModel
    }

    this.setState(state);

    console.log(this.state);
  }

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
        <RegistrationNumber onFound={this.handleRegistrationNumber} />
        <SelectData />
        <EditData data={this.state}/>
      </Container>
    );
  }
}
