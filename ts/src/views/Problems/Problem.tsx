import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import ProblemSolutionModal from './ProblemSolutionModal';
import ProblemRepliesTable from './ProblemRepliesTable'
import ProblemAttachmentsTable from './ProblemAttachmentsTable'
import ProblemForm from './ProblemForm';
import UserComponent from '../UserComponent';
import http from '../../services/httpService';

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

export enum ProblemStatus {
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
  problem: any,
  replyId: number | null,
  showModal: boolean,
  showSolutionModal: boolean,
  attachments: any[],
  replies: any[]
}

export default class Problem extends UserComponent<RouteComponentProps<Params>, State> {
  public state: State = {
    problem: {},
    replyId: null,
    showModal: false,
    showSolutionModal: false,
    attachments: [],
    replies: []
  }

  public get problemId(): string | undefined{
    return this.props.match.params.id;
  }

  private async loadData() {
    try {
      const { data: problem } = await http.get('/problems/open/' + this.problemId);
      const { data: { rows: attachments } } = await http.get('/problemattachments?ProblemId=' + this.problemId);
      const { data: { rows: replies } } = await http.get('/problemreplies?ProblemId=' + this.problemId);

      this.setState({ problem, attachments, replies });
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
    this.setState({ showSolutionModal: true, replyId: row.Id });
  }

  private readonly handleHideSolutionModal = () => {
    this.setState({ showSolutionModal: false });
  }

  private readonly handleSubmitSolutionModal = async () => {
    await this.loadData();

    this.setState({ showSolutionModal: false });
  }

  private readonly handleAttachmentEdited = async () => {
    await this.loadData();
  }

  private readonly handleAttachmentDelete = async (reply: any) => {
    await http.delete('/problemattachments/' + reply.Id);
    await this.loadData();
  }

  private readonly handleReplyEdited = async () => {
    await this.loadData();
  }

  private readonly handleReplyDelete = async (reply: any) => {
    await http.delete('/problemreplies/' + reply.Id);
    await this.loadData();
  }

  private renderModal(): JSX.Element {
    const { problem } = this.state;

    return (
      <ProblemForm
        variant="modal"
        action="edit"
        showModal={true}
        dataId={problem.Id}
        onModalSubmitted={this.handleSubmitModal}
        onHideModal={this.handleHideModal}
      />      
    );
  }

  private renderSolutionModal(): JSX.Element {
    const { problem, replyId } = this.state;

    return (
      <ProblemSolutionModal
        showProblem={false}
        problemId={problem.Id}
        replyId={replyId}
        onSubmit={this.handleSubmitSolutionModal}
        onHide={this.handleHideSolutionModal}
      />
    );
  }

  private renderAttachments(): JSX.Element | null {
    const { problem, attachments } = this.state;

    if (attachments.length === 0)
      return null;

    return (
      <>
        <h4>Liitteet</h4>
        <ProblemAttachmentsTable
          rows={attachments}
          problemId={problem.Id}
          showTitle={false}
          autoHide={true}
          onEdited={this.handleAttachmentEdited}
          onDelete={this.handleAttachmentDelete}
        />
      </>
    );
  }

  private renderReplies(): JSX.Element {
    const { problem, replies } = this.state;

    return (
      <>
        <h4>Vastaukset</h4>
        <ProblemRepliesTable
          rows={replies}
          problemId={problem.Id}
          showTitle={false}
          onSolution={this.handleShowSolutionModal}
          onEdited={this.handleReplyEdited}
          onDelete={this.handleReplyDelete}
        />
      </>
    );
  }

  public render(): JSX.Element {
    const { problem, showModal, showSolutionModal } = this.state;
    const editable = (this.user !== null) && (this.user.isPowerOrAdmin || problem.UserId === this.user.id);

    return (
      <Container>
        <h2>Vikatapaus</h2>
        {editable && <Button className="mb-2" onClick={this.handleShowModal}>Muokkaa</Button>}
        <ProblemForm variant="table" showTitle={false} data={problem} />
        {showModal && this.renderModal()}
        {showSolutionModal && this.renderSolutionModal()}
        {this.renderAttachments()}
        {(problem.Status === ProblemStatus.Open || ((this.user !== null) && this.user.isPowerOrAdmin)) && this.renderReplies()}
      </Container>
    );
  }
}
