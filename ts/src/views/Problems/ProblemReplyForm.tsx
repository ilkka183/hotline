import React from 'react';
import BaseForm from '../BaseForm';
import ProblemSummary from './ProblemSummary';

interface Props {
  problem: any
}

export default class ProblemReplyForm extends BaseForm<Props> {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addField('ProblemId', 'Vikatapaus', 'number',   { required: true, readonly: true, visible: true, getDefaultValue: () => props.parentId });
    this.addField('Date',      'Pvm',        'datetime', { required: true, readonly: true });
    this.addField('UserId',    'Lähettäjä',  'number',   { required: true, readonly: true, lookupUrl: 'Users', getDefaultValue: () => this.user.id });
    this.addField('Message',   'Viesti',     'textarea', { required: true, rows: 5 });
    this.addField('Solution',  'Ratkaisu',   'boolean',  { required: true, getDefaultValue: () => false });

    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return 'problemreplies';
  }

  protected getNewTitle(): string {
    return 'Uusi vastaus';
  }

  protected getEditTitle(): string {
    return 'Muokkaa vastausta';
  }

  protected getDeleteTitle(): string {
    return 'Poista vastaus';
  }

  protected renderInfo(): JSX.Element | null {
    const { problem } = this.props;

    if (!problem)
      return null;

    return <ProblemSummary data={problem} />
  }
}
