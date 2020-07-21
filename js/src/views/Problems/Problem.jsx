import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import ProblemRepliesTable from './ProblemRepliesTable'
import ProblemAttachmentsTable from './ProblemAttachmentsTable'
import LinkButton from '../../components/common/LinkButton';
import ProblemForm from './ProblemForm';
import auth from '../../services/authService';
import http from '../../services/httpService';

export default class Problem extends Component {
  user = auth.getCurrentUser();

  state = {
    problem: {},
    attachments: [],
    replies: []
  }

  get problemId() {
    return this.props.match.params.id;
  }

  async loadData() {
    try {
      const { data: problem } = await http.get('/problems/open/' + this.problemId);
      const { data: attachments } = await http.get('/problemattachments?ProblemId=' + this.problemId);
      const { data: replies } = await http.get('/problemreplies?ProblemId=' + this.problemId);

      this.setState({ problem, attachments, replies });
    }
    catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.loadData();
  }

  handleMarkReply = async reply => {
    await http.put('/problemreplies/' + reply.Id, { Solution: !reply.Solution });
    await http.put('/problems/' + this.state.problem.Id, { Status: 1 });
    await this.loadData();
  }

  handleDeleteReply = async reply => {
    await http.delete('/problemreplies/' + reply.Id);
    await this.loadData();
  }

  renderAttachments() {
    const { problem, attachments } = this.state;

    if (attachments.length === 0)
      return null;

    return (
      <>
        <h4>Liitteet</h4>
        <ProblemAttachmentsTable
          data={attachments}
          problemId={problem.Id}
          showTitle={false}
          showSearchBox={false}
          autoHide={true}
          readOnly={true}
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
          data={replies}
          problemId={problem.Id}
          showTitle={false}
          showSearchBox={false}
          onMark={this.handleMarkReply}
          onDelete={this.handleDeleteReply}
        />
      </>
    );
  }

  render() {
    const { problem } = this.state;
    const editable = (this.user.role <= 1 || problem.UserId === this.user.id);

    return (
      <Container>
        <h2>Vikatapaus</h2>
        {editable && <LinkButton className="new-button" to={'/problems/' + this.problemId}>Muokkaa</LinkButton>}
        <ProblemForm asTable={true} showTitle={false} data={problem} />
        {this.renderAttachments()}
        {this.renderReplies()}
      </Container>
    );
  }
}
