import React from 'react';
import Button from 'react-bootstrap/Button'
import BaseTable from '../BaseTable';
import AnswerForm from './AnswerForm';

interface Props {
  question: any,
  onSolution: (row: any) => void
}

export default class AnswersTable extends BaseTable<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('QuestionId', 'Vikatapaus', 'number',   { visible: false });
    this.addField('Date',       'Pvm',        'datetime', { editLink: true, displayFormat: 'date' });
    this.addField('UserName',   'Lähettäjä',  'text',     { editLink: true });
    this.addField('Message',    'Viesti',     'textarea');
//    this.addField('Solution',  'Ratkaisu',   'boolean');
    this.addField('Mark',       '',           'custom',   { render: row => this.renderSolutionButton(row) });
  }

  protected getTitle(): string {
    return 'Vastaukset';
  }

  protected getApiName(): string {
    return 'answers';
  }

  protected getModalForm(): any {
    return AnswerForm;
  }

  protected getParent(): any {
    return this.props.question;
  }

  protected canDelete(row: any): boolean {
    return this.owns(row.UserId);
  }

  private renderSolutionButton(row: any): JSX.Element | null {
    const { question, onSolution } = this.props;

    if (!this.owns(question.UserId))
      return null;

    const variant = row.Solution ? 'success' : 'warning';

    return (
      <Button variant={variant} onClick={() => onSolution(row)}>Ratkaisu</Button>
    );
  }
}
