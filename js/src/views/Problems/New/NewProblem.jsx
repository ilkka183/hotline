import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import SearchData from './SearchData'
import SelectData from './SelectData'
import EnterData from './EnterData'
import CompositionTitle from './CompositionTitle'
import CompositionDescription from './CompositionDescription'
import ProblemForm from '../ProblemForm'
import auth from '../../../services/authService';
import http from '../../../services/httpService';

export default class NewProblemForm extends Component {
  user = auth.getCurrentUser();

  state = {
    activeKey: undefined,
    step: 0,
    data: null,
    options: {
      engineType: null,
      makes: null,
      modelYears: null,
      fuelTypes: null,
      models: null,
      engineSizes: null,
      engineTypes: null
    },
    title: null,
    description: null
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
      CylinderCount: '',
      EngineSize: '',
      EnginePower: '',
      EngineCode: '',
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

  async componentDidMount() {
    const { data } = await http.get('/data/makes');

    const options = {...this.state.options};
    options.makes = data.map(value => ({ value, text: value }));

    this.setState({ options });
  }

  handleData = (data) => {
    this.setState({ data });
  }

  handleOptions = (options) => {
    this.setState({ options });
  }

  handleTabSelect = (activeKey) => {
    this.setState({ activeKey });
  }

  handleTitleChange = ({ currentTarget: input }) => {
    const title = {...this.state.title}

    title[input.name] = input.value;

    this.setState({ title });
  }

  handleDescriptionChange = ({ currentTarget: input }) => {
    const description = {...this.state.description}

    description[input.name] = input.value;

    this.setState({ description });
  }

  handlePrev = () => {
    const step = this.state.step - 1;

    this.setState({ step });
  }

  handleNext = () => {
    const step = this.state.step + 1;

    this.setState({ step });

    if (step === 2) {
      const data = {...this.state.data}
      data.Title = this.state.title.group.toUpperCase() + ': ' + this.state.title.title;

      this.setState({ data });
    }
    else if (step === 3) {
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

  handleProblemFormSubmitted = () => {
    this.props.history.goBack();
  }

  renderData() {
    return (
      <Tabs defaultActiveKey="enterData" activeKey={this.state.activeKey} onSelect={this.handleTabSelect}>
        <Tab eventKey="searchData" title="Hae ajoneuvon tiedot">
          <SearchData
            data={this.state.data}
            onData={this.handleData}
            onNext={this.handleNext}
          />
        </Tab>
        <Tab eventKey="selectData" title="Valitse ajoneuvon tiedot">
          <SelectData
            data={this.state.data}
            onData={this.handleData}
            options={this.state.options}
            onOptions={this.handleOptions}
            onNext={this.handleNext}
          />
        </Tab>
        <Tab eventKey="enterData" title="Syötä ajoneuvon tiedot">
          <EnterData
            data={this.state.data}
            onData={this.handleData}
            onNext={this.handleNext}
          />
        </Tab>
      </Tabs>
    );
  }

  renderTitle() {
    return (
      <CompositionTitle
        data={this.state.data}
        title={this.state.title}
        onChange={this.handleTitleChange}
        onPrev={this.handlePrev}
        onNext={this.handleNext}
      />
    );
  }

  renderDescription() {
    return (
      <CompositionDescription
        data={this.state.data}
        description={this.state.description}
        onChange={this.handleDescriptionChange}
        onPrev={this.handlePrev}
        onNext={this.handleNext}
      />
    );
  }

  renderProblemForm() {
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
        {this.state.step === 0 && this.renderData()}
        {this.state.step === 1 && this.renderTitle()}
        {this.state.step === 2 && this.renderDescription()}
        {this.state.step === 3 && this.renderProblemForm()}
      </Container>
    );
  }
}
