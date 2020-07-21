import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import RegistrationNumber from './RegistrationNumber'
import SelectData from './SelectData'
import CompositionTitle from './CompositionTitle'
import CompositionDescription from './CompositionDescription'
import ProblemForm from '../ProblemForm'
import auth from '../../../services/authService';

function getFuelType(text) {
  switch (text) {
    case 'bensiini': return 0;
    case 'diesel': return 1;
    default: return 0;
  }
}

export default class NewProblemForm extends Component {
  user = auth.getCurrentUser();

  state = {
    data: null,
    title: null,
    description: null,
    compositionStep: 0,
    manualStep: 0
  }

  constructor() {
    super();

    this.state.data = {
      UserId: this.user.id,
      Make: '',
      Model: '',
      ModelYear: '',
      RegistrationYear: '',
      RegistrationNumber: '',
      FuelType: '',
      Power: '',
      CylinderCount: '',
      EngineCode: '',
      EngineSize: '',
      VIN: '',
      NetWeight: '',
      GrossWeight: '',
      Title: '',
      Description: '',
      Status: 0
    };

    this.state.title = {
      group: '',
      groupOther: '',
      title: ''
    }

    this.state.description = {
      description: '',
      appearance: '',
      appearanceFrequency: '',
      diagnostic: '',
      diagnosticCodes: '',
      tester: '',
      testerOther: '',
      history: '',
      text: ''
    }
  }

  handleRegistrationNumber = (info) => {
    const data = {...this.state.data}

    data.Make = info.carMake;
    data.Model = info.carModel;
    data.RegistrationYear = info.registrationYear;
    data.RegistrationNumber = info.registrationNumber;
    data.FuelType = getFuelType(info.fuelType);
    data.EnginePower = info.power;
    data.CylinderCount = info.cylinderCount;
    data.EngineCode = info.engineCode;
    data.EngineSize = info.engineSize;
    data.VIN = info.vechileIdentificationNumber;
    data.NetWeight = info.netWeight;
    data.GrossWeight = info.grossWeight;

    console.log(data);

    this.setState({ data });
  }

  handleDataSelected = (info) => {
    const data = {...this.state.data}

    data.Make = info.make;
    data.Model = info.model;
    data.ModelYear = info.modelYear;
    data.FuelType = info.fuelType;
    data.EngineSize = info.engineSize;
    data.EnginePower = info.enginePower;
    data.EngineCode = info.engineCode;
    data.VIN = info.vin;
    data.RegistrationNumber = info.registrationNumber;

    const compositionStep = 2;

    this.setState({ data, compositionStep });
  }

  handleTitleChange = ({ currentTarget: input }) => {
    const title = {...this.state.title}

    title[input.name] = input.value;

    console.log(title);

    this.setState({ title });
  }

  handleDescriptionChange = ({ currentTarget: input }) => {
    const description = {...this.state.description}

    description[input.name] = input.value;

    this.setState({ description });
  }

  handleManualRegistrationNumber = (info) => {
    this.handleRegistrationNumber(info);

    this.setState({ manualStep: 1 });
  }

  handleCompositionRegistrationNumber = (info) => {
    this.handleRegistrationNumber(info);

    this.setState({ compositionStep: 2 });
  }

  handleCompositionPrev = () => {
    const compositionStep = this.state.compositionStep - 1;

    this.setState({ compositionStep });
  }

  handleCompositionNext = () => {
    const compositionStep = this.state.compositionStep + 1;

    this.setState({ compositionStep });

    if (compositionStep === 3) {
      const data = {...this.state.data}
      data.Title = this.state.title.group.toUpperCase() + ': ' + this.state.title.title;

      this.setState({ data });
    }
    else if (compositionStep === 4) {
      let lines = '';
      let index = 0;

      const { description, appearance, diagnostic, tester, history, text } = this.state.description;

      if (description)
        addGroup('Asiakkaan viankuvaus:', description);

      if (appearance)
        addGroup('Vian esiintyminen:', appearance);

      if (diagnostic)
        addGroup('Itsediagnostiikka:', diagnostic);

      if (tester)
        addGroup('Käytetty testilaite:', tester);

      if (history)
        addGroup('Korjaushistoria:', history);

      if (text)
        addGroup('Vapaa teksti:', text);

      const data = {...this.state.data}
      data.Description = lines;

      this.setState({ data });

      function addGroup(title, text) {
        if (index > 0)
          lines += '\n\n';

        lines += title;
        lines += '\n';
        lines += text;

        index++;
      }
    }
  }

  handleManualPrev = () => {
    const manualStep = this.state.manualStep - 1;

    this.setState({ manualStep });
  }

  handleManualNext = () => {
    const manualStep = this.state.manualStep + 1;

    this.setState({ manualStep });
  }

  handleProblemFormSubmitted = () => {
    this.props.history.goBack();
  }

  renderCompositionRegistrationNumber() {
    return (
      <RegistrationNumber
        onFound={this.handleCompositionRegistrationNumber}
        onNext={this.handleCompositionNext}
      />
    );
  }

  renderManualRegistrationNumber() {
    return (
      <RegistrationNumber
        onFound={this.handleManualRegistrationNumber}
        onNext={this.handleManualNext}
      />
    );
  }

  renderCompositionSelectData() {
    return (
      <>
        <h4>Valitse ajoneuvon tiedot</h4>
        <SelectData
          onSelected={this.handleDataSelected}
        />
      </>
    );
  }

  renderCompositionTitle() {
    return (
      <CompositionTitle
        data={this.state.data}
        title={this.state.title}
        onChange={this.handleTitleChange}
        onNext={this.handleCompositionNext}
      />
    );
  }

  renderCompositionDescription() {
    return (
      <CompositionDescription
        data={this.state.data}
        description={this.state.description}
        onChange={this.handleDescriptionChange}
        onPrev={this.handleCompositionPrev}
        onNext={this.handleCompositionNext}
      />
    );
  }

  renderCompositionProblemForm() {
    return (
      <>
        <h3>Syötä ajoneuvon tiedot ja vian kuvaus</h3>
        <ProblemForm
          defaultData={this.state.data}
          showTitle={false}
          onPrev={this.handleCompositionPrev}
          onSubmitted={this.handleProblemFormSubmitted}
        />
      </>
    );
  }

  renderManualProblemForm() {
    return (
      <>
        <h3>Syötä ajoneuvon tiedot ja vian kuvaus</h3>
        <ProblemForm
          defaultData={this.state.data}
          showTitle={false}
          onSubmitted={this.handleProblemFormSubmitted}
        />
      </>
    );
  }

  render() {
    return (
      <Container>
        <h2>Lisää uusi vikatapaus</h2>
        <Tabs className="mb-2" defaultActiveKey="home" id="uncontrolled-tab-example" onSelect={this.handleSelect}>
          <Tab eventKey="composition" title="Ohjattu syöttö">
            {this.state.compositionStep === 0 && this.renderCompositionRegistrationNumber()}
            {this.state.compositionStep === 1 && this.renderCompositionSelectData()}
            {this.state.compositionStep === 2 && this.renderCompositionTitle()}
            {this.state.compositionStep === 3 && this.renderCompositionDescription()}
            {this.state.compositionStep === 4 && this.renderCompositionProblemForm()}
          </Tab>
          <Tab eventKey="manual" title="Manuaalinen syöttö">
            {this.state.manualStep === 0 && this.renderManualRegistrationNumber()}
            {this.state.manualStep === 1 && this.renderManualProblemForm()}
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
