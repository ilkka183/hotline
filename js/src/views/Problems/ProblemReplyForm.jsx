import React from 'react';
import BaseForm from '../BaseForm';
import ProblemSummary from './ProblemSummary';
import queryString from 'query-string';
import http from '../../services/httpService';

export default class ProblemReplyForm extends BaseForm {
  state = {
    problem: null,
    data: {},
    errors: {}
  }

  constructor(props) {
    super(props);

    this.addId();
    this.addField('ProblemId', 'Vikatapaus', 'number',   { required: true, readonly: true, visible: false, getDefaultValue: () => queryString.parse(props.location.search).ProblemId });
    this.addField('Date',      'Pvm',        'datetime', { required: true, readonly: true });
    this.addField('UserId',    'Lähettäjä',  'number',   { required: true, readonly: true, lookupUrl: 'Users', getDefaultValue: () => this.user.id });
    this.addField('Message',   'Viesti',     'textarea', { required: true, rows: 5 });
    this.addField('Solution',  'Ratkaisu',   'boolean',  { required: true, readonly: true, getDefaultValue: () => false });

    this.state.data = this.getEmptyData();
  }

  getTitle() {
    return 'Vastaus';
  }

  getApiName() {
    return 'problemreplies';
  }

  async componentDidMount() {
    super.componentDidMount();

    if (this.props.match.params.id === 'new') {
      const problemId =  queryString.parse(this.props.location.search).ProblemId;

      const { data: problem } = await http.get('/problems/' + problemId);
  
      this.setState({ problem });
    }
    else {
      const problemReplyId =  this.props.match.params.id;

      const { data: problemReply } = await http.get('/problemreplies/' + problemReplyId);
      const { data: problem } = await http.get('/problems/' + problemReply.ProblemId);
  
      this.setState({ problem });
    }
  }

  renderInfo() {
    const { problem } = this.state;

    if (!problem)
      return null;

    return <ProblemSummary data={problem} />
  }
}
