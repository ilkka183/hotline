import React from 'react';
import Button from 'react-bootstrap/Button'
import BaseTable from '../BaseTable';

export default class ProblemRepliessTable extends BaseTable {
  constructor() {
    super();

    this.addId();
    this.addField('ProblemId', 'Vikatapaus', 'number',   { visible: false });
    this.addField('Date',      'Pvm',        'datetime', { displayFormat: 'date' });
    this.addField('UserName',  'Lähettäjä',  'text');
    this.addField('Message',   'Viesti',     'textarea', { editLink: true, rows: 5 });
    this.addField('Solution',  'Ratkaisu',   'boolean');
    this.addField('Mark',      '',           'custom',   { render: row => this.renderSolutionButton(row) });
  }

  getTitle() {
    return 'Vastaukset';
  }

  getApiName() {
    return 'problemreplies';
  }

  getNewButtonLink() {
    return `/${this.getApiName()}/new?ProblemId=${this.props.problemId}`;
  }

  canEdit(row) {
    return (this.user.role <= 1 || row.UserId === this.user.id);
  }

  canDelete(row) {
    return (this.user.role <= 1 || row.UserId === this.user.id) && !row.Solution;
  }

  renderSolutionButton(row) {
    const variant = row.Solution ? 'success' : 'warning';

    return (
      <Button
        variant={variant}
        size="sm"
        onClick={() => this.props.onMark(row)}
      >
        Ratkaisu
      </Button>
    );
  }
}
