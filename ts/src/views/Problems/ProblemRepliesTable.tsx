import React from 'react';
import Button from 'react-bootstrap/Button'
import BaseTable from '../BaseTable';
import ProblemReplyForm from './ProblemReplyForm';

interface Props {
  problemId: number,
  problemUserId: number,
  problem: any,
  onSolution: (row: any) => void
}

export default class ProblemRepliessTable extends BaseTable<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('ProblemId', 'Vikatapaus', 'number',   { visible: false });
    this.addField('Date',      'Pvm',        'datetime', { displayFormat: 'date' });
    this.addField('UserName',  'Lähettäjä',  'text');
    this.addField('Message',   'Viesti',     'textarea', { editLink: true, rows: 5 });
//    this.addField('Solution',  'Ratkaisu',   'boolean');
    this.addField('Mark',      '',           'custom',   { render: row => this.renderSolutionButton(row) });
  }

  protected getTitle(): string {
    return 'Vastaukset';
  }

  protected getApiName(): string {
    return 'problemreplies';
  }

  protected getModalForm(): any {
    return ProblemReplyForm;
  }

  protected getParentId(): number | null {
    return this.props.problemId;
  }

  protected getParent(): any {
    return this.props.problem;
  }

  private renderSolutionButton(row: any): JSX.Element | null {
    const { problemUserId, onSolution } = this.props;

    if (!this.owns(problemUserId))
      return null;

    const variant = row.Solution ? 'success' : 'warning';

    return (
      <Button variant={variant} onClick={() => onSolution(row)}>Ratkaisu</Button>
    );
  }
}
