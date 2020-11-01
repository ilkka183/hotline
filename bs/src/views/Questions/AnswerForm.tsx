import React from 'react';
import BaseForm from '../BaseForm';
import QuestionSummary from './QuestionSummary';

interface Props {
  parent: any
}

export default class AnswerForm extends BaseForm<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('QuestionId', 'Vikatapaus', 'number',   { required: true, readonly: true, visible: true, getDefaultValue: () => props.parent.Id });
    this.addField('Date',       'Pvm',        'datetime', { required: true, readonly: true });
    this.addField('UserId',     'Lähettäjä',  'number',   { required: true, readonly: true, lookupUrl: 'Users', getDefaultValue: () => this.user ? this.user.id : null });
    this.addField('Message',    'Viesti',     'textarea', { required: true, rows: 5 });

    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return 'answers';
  }

  protected getInsertTitle(): string {
    return 'Lisää uusi vastaus';
  }

  protected getUpdateTitle(): string {
    return 'Muokkaa vastausta';
  }

  protected getDeleteTitle(): string {
    return 'Poista vastaus';
  }

  protected renderInfo(): JSX.Element {
    const { parent: question } = this.props;

    return <QuestionSummary data={question} />
  }
}
