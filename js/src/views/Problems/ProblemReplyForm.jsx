import React from 'react';
import BaseForm from '../BaseForm';
import ProblemSummary from './ProblemSummary';
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
    this.addField('ProblemId', 'Vikatapaus', 'number',   { required: true, readonly: true, visible: false, getDefaultValue: () => props.parentId });
    this.addField('Date',      'Pvm',        'datetime', { required: true, readonly: true });
    this.addField('UserId',    'Lähettäjä',  'number',   { required: true, readonly: true, lookupUrl: 'Users', getDefaultValue: () => this.user.id });
    this.addField('Message',   'Viesti',     'textarea', { required: true, rows: 5 });
    this.addField('Solution',  'Ratkaisu',   'boolean',  { required: true, readonly: true, getDefaultValue: () => false });

    this.state.data = this.getEmptyData();
  }

  getApiName() {
    return 'problemreplies';
  }

  getNewTitle() {
    return 'Uusi vastaus';
  }

  getEditTitle() {
    return 'Muokkaa vastausta';
  }

  getDeleteTitle() {
    return 'Poista vastaus';
  }

  async componentDidMount() {
    super.componentDidMount();

/*    if (this.props.match.params.id === 'new') {
      const problemId =  this.props.parentId;

      const { data: problem } = await http.get('/problems/' + problemId);
  
      this.setState({ problem });
    }
    else {
      const problemReplyId =  this.props.match.params.id;

      const { data: problemReply } = await http.get('/problemreplies/' + problemReplyId);
      const { data: problem } = await http.get('/problems/' + problemReply.ProblemId);
  
      this.setState({ problem });
    } */
  }

  renderInfo() {
    const { problem } = this.state;

    if (!problem)
      return null;

    return <ProblemSummary data={problem} />
  }
}
