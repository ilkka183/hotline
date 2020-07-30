import React from 'react';
import LinkButton from '../../components/common/LinkButton';
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

  getNewButtonLink() {
    return `/${this.getApiName()}/new?ProblemId=${this.props.problemId}`;
  }

/*  
  canEdit(row) {
    return (this.user.role <= 1 || row.UserId === this.user.id);
  }

  canDelete(row) {
    return (this.user.role <= 1 || row.UserId === this.user.id) && !row.Solution;
  }
*/

  renderSolutionButton(row) {
    const variant = row.Solution ? 'success' : 'warning';

    return (
      <LinkButton
        className={'btn-sm btn-' + variant}
        to={'/problems/solution/' + this.props.problemId + '?ReplyId=' + row.Id}
      >
        Ratkaisu
      </LinkButton>
    );
  }
}
