import React from 'react';
import BaseForm from '../BaseForm';
import ProblemSummary from './ProblemSummary';

export default class ProblemReplyForm extends BaseForm {
  state = {
    data: {},
    errors: {}
  }

  constructor(props) {
    super(props);

    console.log(props.parentId);

    this.addId();
    this.addField('ProblemId', 'Vikatapaus', 'number',   { required: true, readonly: true, visible: true, getDefaultValue: () => props.parentId });
    this.addField('Date',      'Pvm',        'datetime', { required: true, readonly: true });
    this.addField('UserId',    'Lähettäjä',  'number',   { required: true, readonly: true, lookupUrl: 'Users', getDefaultValue: () => this.user.id });
    this.addField('Message',   'Viesti',     'textarea', { required: true, rows: 5 });
    this.addField('Solution',  'Ratkaisu',   'boolean',  { required: true, getDefaultValue: () => false });

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

  renderInfo() {
    const { problem } = this.props;

    if (!problem)
      return null;

    return <ProblemSummary data={problem} />
  }
}
