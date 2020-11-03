import React from 'react';
import Button from 'react-bootstrap/Button'
import BaseTable from '../BaseTable';
import AnswerForm from './AnswerForm';
import QuestionForm from './QuestionForm';

interface Props {
  question: any,
  onSolution: (row: any) => void
}

export default class AnswersTable extends BaseTable<Props> {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addField('QuestionId', 'Vikatapaus', 'number',   { visible: false });
    this.addField('Date',       'Pvm',        'datetime', { displayFormat: 'date' });
    this.addField('UserName',   'Lähettäjä',  'text',     { show: row => this.showUser(row) });
    this.addField('Message',    'Viesti',     'textarea', { render: row => QuestionForm.renderText(row.Message) });
    this.addField('File',       'Liite',      'text');
    this.addField('Mark',       '',           'custom',   { render: row => this.renderSolutionButton(row) });
  }

  protected getTitle(): string {
    return 'Vastaukset';
  }

  protected getApiName(): string {
    return 'answer';
  }

  protected getModalForm(): any {
    return AnswerForm;
  }

  protected getParent(): any {
    return this.props.question;
  }

  protected canUpdateRow(row: any): boolean {
    return this.owns(row.UserId);
  }

  protected canDeleteRow(row: any): boolean {
    return this.owns(row.UserId);
  }

  private showUser(row: any): boolean {
    return this.owns(row.UserId);
  }

  private renderSolutionButton(row: any): JSX.Element | null {
    const { question, onSolution } = this.props;

    if (!this.owns(question.UserId))
      return null;

    return (
      <Button variant="warning" size="sm" onClick={() => onSolution(row)}>Ratkaisu</Button>
    );
  }
}
