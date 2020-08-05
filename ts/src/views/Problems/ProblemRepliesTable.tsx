import React from 'react';
import Button from 'react-bootstrap/Button'
import BaseTable from '../BaseTable';
import ProblemReplyForm from './ProblemReplyForm';

export default class ProblemRepliessTable extends BaseTable {
  constructor() {
    super();

    this.addId();
    this.addField('ProblemId', 'Vikatapaus', 'number',   { visible: false });
    this.addField('Date',      'Pvm',        'datetime', { displayFormat: 'date' });
    this.addField('UserName',  'Lähettäjä',  'text');
    this.addField('Message',   'Viesti',     'textarea', { editLink: true, rows: 5 });
//    this.addField('Solution',  'Ratkaisu',   'boolean');
    this.addField('Mark',      '',           'custom',   { render: row => this.renderSolutionButton(row) });
  }

  getTitle() {
    return 'Vastaukset';
  }

  getApiName() {
    return 'problemreplies';
  }

  getForm() {
    return ProblemReplyForm;
  }

  getParentId() {
    return this.props.problemId;
  }

  renderSolutionButton(row) {
    const { onSolution } = this.props;

    const variant = row.Solution ? 'success' : 'warning';

    return (
      <Button variant={variant} onClick={() => onSolution(row)}>Ratkaisu</Button>
    );
  }
}
