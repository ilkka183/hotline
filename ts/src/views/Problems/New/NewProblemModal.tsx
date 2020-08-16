import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import SearchData from './SearchData'
import SelectData from './SelectData'
import EnterData from './EnterData'
import ComposeTitle, { GROUPS } from './ComposeTitle'
import ComposeDescription, { TESTERS } from './ComposeDescription'
import ProblemForm from '../ProblemForm'
import { ProblemStatus } from '../Problem'
import UserComponent from '../../UserComponent';
import Lines from '../../../lib/Lines';
import http from '../../../services/httpService';

enum ProblemStep {
  Data,
  Title,
  Description,
  Problem
}

interface Props {
  onSubmit: () => void,
  onHide: () => void
}

interface State {
  activeKey: any,
  step: ProblemStep,
  stepReady: boolean[],
  data: any,
  options: {
    makes: any,
    modelYears: any,
    fuelTypes: any,
    models: any,
    engineSizes: any,
    engineTypes: any,
    engineType: any
  },
  title: any,
  description: any
}

export default class NewProblemForm extends UserComponent<Props, State> {
  public state: State = {
    activeKey: undefined,
    step: ProblemStep.Data,
    stepReady: [false, false, false, false],
    data: null,
    options: {
      makes: null,
      modelYears: null,
      fuelTypes: null,
      models: null,
      engineSizes: null,
      engineTypes: null,
      engineType: null
    },
    title: null,
    description: null
  }

  constructor(props: Props) {
    super(props);

    this.state.data = {
      UserId: this.user?.id,
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
      Status: ProblemStatus.Open
    };

    this.state.title = {
      group: '',
      groupOther: '',
      title: ''
    }

    const testers: boolean[] = [];

    for (let i: number = 0; i < TESTERS.length; i++)
      testers.push(false);

    this.state.description = {
      description: '',
      appearance: '',
      appearanceFrequency: '',
      diagnostic: '',
      diagnosticCodes: '',
      testers,
      testerOther: '',
      history: '',
      text: ''
    }
  }

  public async componentDidMount() {
    const { data } = await http.get('/data/makes');

    const options: any = {...this.state.options};
    options.makes = data.map((value: any) => ({ value, text: value }));

    this.setState({ options });
  }

  private isDataReady(): boolean {
    const { data } = this.state;

    return data.Make;
  }

  private isTitleReady(): boolean {
    const { title } = this.state;

    return title &&
      title.group &&
      (title.group !== GROUPS[GROUPS.length - 1] || title.groupOther) &&
      title.title;
  }

  private isDescriptionReady(): boolean {
    const { description } = this.state;

    return description.description;
  }

  private isProblemReady(): boolean {
    return true;
  }

  private isStepReady(): boolean {
    const { step } = this.state;

    switch (step) {
      case ProblemStep.Data: return this.isDataReady();
      case ProblemStep.Title: return this.isTitleReady();
      case ProblemStep.Description: return this.isDescriptionReady();
      case ProblemStep.Problem: return this.isProblemReady();
    }

    return false;
  }

  private readonly handleData = (data: any) => {
    this.setState({ data });
  }

  private readonly handleOptions = (options: any) => {
    this.setState({ options });
  }

  private readonly handleTabSelect = (activeKey: any) => {
    this.setState({ activeKey });
  }

  private readonly handleTitleChange = ({ currentTarget: input }: any) => {
    const title = {...this.state.title}

    title[input.name] = input.value;

    this.setState({ title });
  }

  private readonly handleDescriptionChange = ({ currentTarget: target }: any) => {
    const description: any = {...this.state.description}

    description[target.name] = target.value;

    this.setState({ description });
  }

  private readonly handleDescriptionChangeCheckboxGroup = ({ currentTarget: target }: any) => {
    const description: any = {...this.state.description}

    description[target.name][target.id - 1] = target.checked;

    this.setState({ description });
  }

  private readonly handlePrev = () => {
    const step: ProblemStep = this.state.step - 1;

    this.setState({ step });
  }

  private readonly handleNext = () => {
    const { step } = this.state;
    const data: any = {...this.state.data}

    switch (step) {
      case ProblemStep.Title:
        data.Title = this.formatTitle();
        break;

      case ProblemStep.Description:
        data.Description = this.formatDescription();
        break;
    }

    this.setState({ step: step + 1, data });
  }

  private formatTitle(): string {
    const { group, groupOther, title } = this.state.title;
    
    const groupName: string = (group === GROUPS[GROUPS.length - 1]) ? groupOther : group;

    return groupName.toUpperCase() + ': ' + title;
  }
  
  private formatDescription(): string {
    const { description, appearance, diagnostic, testers, history, text } = this.state.description;

    const lines = new Lines();

    if (description)
      lines.addText('Asiakkaan viankuvaus:', description);

    if (appearance)
      lines.addText('Vian esiintyminen:', appearance);

    if (diagnostic)
      lines.addText('Itsediagnostiikka:', diagnostic);

    if (testers)
      lines.addTexts('Käytettyt testilaitteet:', testers, TESTERS);

    if (history)
      lines.addText('Korjaushistoria:', history);

    if (text)
      lines.addText('Vapaa teksti:', text);

    return lines.toString;
  }
  
  private readonly handleSubmit = () => {
    const { onSubmit }: any = this.props;

    try {
      (this.refs.problemForm as any).handleSubmit();
      onSubmit();
    }
    catch (ex) {
    }
  }

  private renderData(): JSX.Element {
    const searchKey: string = 'searchData';
    const selectKey: string = 'selectData';
    const enterKey: string = 'enterData';

    return (
      <Tabs defaultActiveKey={searchKey} activeKey={this.state.activeKey} onSelect={this.handleTabSelect}>
        <Tab eventKey={searchKey} title="Hae ajoneuvon tiedot">
          <SearchData
            data={this.state.data}
            onData={this.handleData}
          />
        </Tab>
        <Tab eventKey={selectKey} title="Valitse ajoneuvon tiedot">
          <SelectData
            data={this.state.data}
            onData={this.handleData}
            options={this.state.options}
            onOptions={this.handleOptions}
          />
        </Tab>
        <Tab eventKey={enterKey} title="Syötä ajoneuvon tiedot">
          <EnterData
            data={this.state.data}
            onData={this.handleData}
          />
        </Tab>
      </Tabs>
    );
  }

  private renderTitle(): JSX.Element {
    return (
      <ComposeTitle
        data={this.state.data}
        title={this.state.title}
        onChange={this.handleTitleChange}
      />
    );
  }

  private renderDescription(): JSX.Element {
    return (
      <ComposeDescription
        data={this.state.data}
        description={this.state.description}
        onChange={this.handleDescriptionChange}
        onChangeCheckboxGroup={this.handleDescriptionChangeCheckboxGroup}
      />
    );
  }

  private renderProblemForm(): JSX.Element {
    return (
      <>
        <h3>Syötä ajoneuvon tiedot ja vian kuvaus</h3>
        <ProblemForm
          ref="problemForm"
          defaultData={this.state.data}
          showTitle={false}
          showSubmitButton={false}
          onPrev={this.handlePrev}
          onSubmitted={this.handleSubmit}
        />
      </>
    );
  }

  public render(): JSX.Element {
    const { onHide } = this.props;
    const { step } = this.state;

    return (
      <Modal
        size="xl"
        backdrop="static"
        show={true}
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>Lisää uusi vikatapaus</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {step === ProblemStep.Data && this.renderData()}
          {step === ProblemStep.Title && this.renderTitle()}
          {step === ProblemStep.Description && this.renderDescription()}
          {step === ProblemStep.Problem && this.renderProblemForm()}
        </Modal.Body>

        <Modal.Footer>
          <div className="mr-auto" >
            {(step > ProblemStep.Data) && <Button variant="primary" className="mr-2" onClick={this.handlePrev}>Edellinen</Button>}
            {(step < ProblemStep.Problem) && <Button variant="primary" disabled={!this.isStepReady()} onClick={this.handleNext}>Seuraava</Button>}
          </div>
          {(step === ProblemStep.Problem) && <Button variant="primary" onClick={this.handleSubmit}>Tallenna</Button>}
          <Button variant="secondary" onClick={onHide}>Peru</Button>
        </Modal.Footer>
      </Modal>      
    );
  }
}
