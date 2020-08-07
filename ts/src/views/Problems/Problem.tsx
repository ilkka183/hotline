import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import ProblemSolutionModal from './ProblemSolutionModal';
import ProblemRepliesTable from './ProblemRepliesTable'
import ProblemAttachmentsTable from './ProblemAttachmentsTable'
import ProblemForm from './ProblemForm';
import auth from '../../services/authService';
import http from '../../services/httpService';

interface State {
  problem: any,
  replyId: number | null,
  showModal: boolean,
  showSolutionModal: boolean,
  attachments: any[],
  replies: any[]
}

export default class Problem extends Component<{}, State> {
  private user: any = auth.getCurrentUser();

  public state: State = {
    problem: {},
    replyId: null,
    showModal: false,
    showSolutionModal: false,
    attachments: [],
    replies: []
  }

  get problemId() {
//    return this.props.match.params.id;
    return 1;
  }

  async loadData() {
    try {
      const { data: problem } = await http.get('/problems/open/' + this.problemId);
      const { data: { rows: attachments } } = await http.get('/problemattachments?ProblemId=' + this.problemId);
      const { data: { rows: replies } } = await http.get('/problemreplies?ProblemId=' + this.problemId);

      this.setState({ problem, attachments, replies });
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404) {
//        this.props.history.replace('/not-found');
      }
    }
  }

  async componentDidMount() {
    await this.loadData();
  }

  handleShowModal = () => {
    this.setState({ showModal: true });
  }

  handleHideModal = () => {
    this.setState({ showModal: false });
  }

  handleSubmitModal = async () => {
    await this.loadData();

    this.setState({ showModal: false });
  }

  handleShowSolutionModal = (row: any) => {
    this.setState({ showSolutionModal: true, replyId: row.Id });
  }

  handleHideSolutionModal = () => {
    this.setState({ showSolutionModal: false });
  }

  handleSubmitSolutionModal = async () => {
    await this.loadData();

    this.setState({ showSolutionModal: false });
  }

  handleAttachmentEdited = async () => {
    await this.loadData();
  }

  handleAttachmentDelete = async (reply: any) => {
    await http.delete('/problemattachments/' + reply.Id);
    await this.loadData();
  }

  handleReplyEdited = async () => {
    await this.loadData();
  }

  handleReplyDelete = async (reply: any) => {
    await http.delete('/problemreplies/' + reply.Id);
    await this.loadData();
  }

  renderModal() {
    const { problem } = this.state;

    return (
      <ProblemForm
        variant="modal"
        action="edit"
        showModal={true}
        dataId={problem.Id}
        onSubmitModal={this.handleSubmitModal}
        onHideModal={this.handleHideModal}
      />      
    );
  }

  renderSolutionModal() {
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

  renderAttachments() {
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
          showSearchBox={false}
          autoHide={true}
          onEdited={this.handleAttachmentEdited}
          onDelete={this.handleAttachmentDelete}
        />
      </>
    );
  }

  renderReplies() {
    const { problem, replies } = this.state;

    return (
      <>
        <h4>Vastaukset</h4>
        <ProblemRepliesTable
          rows={replies}
          problemId={problem.Id}
          showTitle={false}
          showSearchBox={false}
          onSolution={this.handleShowSolutionModal}
          onEdited={this.handleReplyEdited}
          onDelete={this.handleReplyDelete}
        />
      </>
    );
  }

  render() {
    const { problem, showModal, showSolutionModal } = this.state;
    const editable = (this.user.role <= 1 || problem.UserId === this.user.id);

    return (
      <Container>
        <h2>Vikatapaus</h2>
        {editable && <Button className="mb-2" onClick={this.handleShowModal}>Muokkaa</Button>}
        <ProblemForm variant="table" showTitle={false} data={problem} />
        {showModal && this.renderModal()}
        {showSolutionModal && this.renderSolutionModal()}
        {this.renderAttachments()}
        {(problem.Status === 0 || this.user.role <= 1) && this.renderReplies()}
      </Container>
    );
  }
}
