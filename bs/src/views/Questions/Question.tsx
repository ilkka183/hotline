import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import QuestionSolutionModal from './QuestionSolutionModal';
import AnswersTable from './AnswersTable'
import QuestionForm from './QuestionForm';
import UserComponent from '../UserComponent';
import http from '../../services/httpService';
import { EditMode } from '../../components/common/FieldsForm';

export enum FuelType {
  Petrol,
  Diesel,
  PetrolHybrid,
  DieselHybrid,
  Methane,
  Electricity
}

export const FUEL_TYPE_TEXTS = [
  'bensiini',
  'diesel',
  'bensiinihybridi',
  'dieselhybridi',
  'kaasu',
  'sähkö'
];

export enum QuestionStatus {
  Open,
  Solved,
  Unsolved
}

export const STATUS_TEXTS = [
  'avoin',
  'ratkaistu',
  'ratkaisematon'
];

interface Params {
  id?: string;
}

interface State {
  question: any,
  answerId: number | null,
  showModal: boolean,
  showSolutionModal: boolean,
  answers: any[]
}

export default class Question extends UserComponent<RouteComponentProps<Params>, State> {
  public state: State = {
    question: {},
    answerId: null,
    showModal: false,
    showSolutionModal: false,
    answers: []
  }

  public get questionId(): string | undefined{
    return this.props.match.params.id;
  }

  private async loadData() {
    try {
      const { data: question } = await http.get('/question/open/' + this.questionId);
      const { data: { rows: answers } } = await http.get('/answer?QuestionId=' + this.questionId);

      this.setState({ question, answers });
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  public async componentDidMount() {
    await this.loadData();
  }

  private readonly handleShowModal = () => {
    this.setState({ showModal: true });
  }

  private readonly handleHideModal = () => {
    this.setState({ showModal: false });
  }

  private readonly handleSubmitModal = async () => {
    await this.loadData();

    this.setState({ showModal: false });
  }

  private readonly handleShowSolutionModal = (row: any) => {
    this.setState({ showSolutionModal: true, answerId: row.Id });
  }

  private readonly handleHideSolutionModal = () => {
    this.setState({ showSolutionModal: false });
  }

  private readonly handleSubmitSolutionModal = async () => {
    await this.loadData();

    this.setState({ showSolutionModal: false });
  }

  private readonly handleAnswerEdited = async () => {
    await this.loadData();
  }

  private readonly handleAnswerDelete = async (answer: any) => {
    await http.delete('/answer/' + answer.Id);
    await this.loadData();
  }

  private renderModal(): JSX.Element {
    const { question } = this.state;

    return (
      <QuestionForm
        variant="modal"
        editMode={EditMode.Update}
        showModal={true}
        dataId={question.Id}
        onModalSubmitted={this.handleSubmitModal}
        onHideModal={this.handleHideModal}
      />      
    );
  }

  private renderSolutionModal(): JSX.Element {
    const { question, answerId } = this.state;

    return (
      <QuestionSolutionModal
        showQuestion={false}
        questionId={question.Id}
        answerId={answerId}
        onSubmit={this.handleSubmitSolutionModal}
        onHide={this.handleHideSolutionModal}
      />
    );
  }

  private renderAnswers(): JSX.Element {
    const { question, answers } = this.state;

    return (
      <>
        <h4>Vastaukset</h4>
        <AnswersTable
          question={question}
          rows={answers}
          showTitle={false}
          onSolution={this.handleShowSolutionModal}
          onEdited={this.handleAnswerEdited}
          onDelete={this.handleAnswerDelete}
        />
      </>
    );
  }

  public render(): JSX.Element {
    const { question, showModal, showSolutionModal } = this.state;
    const editable = this.user?.owns(question.UserId);

    return (
      <Container>
        <h2>Vikatapaus</h2>
        {editable && <Button className="mb-2" onClick={this.handleShowModal}>Muokkaa</Button>}
        <QuestionForm variant="table" showTitle={false} data={question} />
        {showModal && this.renderModal()}
        {showSolutionModal && this.renderSolutionModal()}
        {(question.Status === QuestionStatus.Open || this.user?.isPowerOrAdmin) && this.renderAnswers()}
      </Container>
    );
  }
}
