import React from 'react';
import { Link } from 'react-router-dom';
import BaseTable from '../BaseTable';
import QuestionForm from './QuestionForm';
import NewQuestionModal from './New/NewQuestionModal';
import { QuestionStatus, FUEL_TYPE_TEXTS, STATUS_TEXTS } from './Question';

interface Props {
  status?: QuestionStatus;
  userId?: number;
  id?: string;
}

export default class QuestionsTable extends BaseTable<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('Date',        'Pvm',                  'datetime', { displayFormat: 'date' });
    this.addField('UserName',    'Lähettäjä',            'text',     { visible: this.isPowerOrAdmin });
    this.addField('Make',        'Merkki',               'text',     { search: true });
    this.addField('Model',       'Malli',                'text',     { search: true });
    this.addField('ModelYear',   'Vuosimalli',           'number');
    this.addField('FuelType',    'Käyttövoima',          'number',   { enums: FUEL_TYPE_TEXTS });
    this.addField('EngineCode',  'Moottorin tunnus',     'text',     { visible: false, search: true });
//    this.addField('Title',       'Otsikko',              'text',     { search: true, link: item => '/question/' + item.Id });
    this.addField('Description', 'Kuvaus ja vastaukset', 'text',     { search: true, render: this.renderDescription });
    this.addField('Status',      'Tila',                 'number',   { render: this.renderStatus });
    this.addConverted();
  }

  protected getPageSize(): number {
    return 5;
  }

  public getTitle(): string {
    return 'Vikatapaukset';
  }

  public getApiName(): string {
    return 'question';
  }

  public getModalForm(): any {
    return QuestionForm;
  }  

  protected getItemsQuery(query: any) {
    const { status, userId } = this.props;

    if (status !== undefined)
      query.Status = status;

    if (userId !== undefined)
      query.UserId = userId;
  }

  protected canUpdateRow(row: any): boolean {
    return this.owns(row.UserId);
  }

  protected canDeleteRow(row: any): boolean {
    return this.owns(row.UserId);
  }

  private renderDescription(row: any): JSX.Element {
    return (
      <>
        <Link to={'/question/' + row.Id}>{row.Title}</Link>
        <div className="description1">
          {truncate(row.Description)}
        </div>
        {row.Solution && <div>{truncate(row.Solution)}</div>}
        {!row.Solution && row.Answers.map((reply: any, index: number) => <div key={index}>- {truncate(reply.Message)}</div>)}
      </>
    );
  }

  private renderStatus(row: any): JSX.Element {
    const classNames = ['open', 'solved', 'unsolved'];
    
    return <span className={classNames[row.Status]}>{STATUS_TEXTS[row.Status]}</span>
  }

  protected showNewModal() {
    this.setState({ showNewModal: true });
  }

  private readonly handleNewModalSubmitted = async () => {
    await this.fetchItems({});

    this.setState({ showNewModal: false });
  }

  private readonly handleHideNewModal = () => {
    this.setState({ showNewModal: false });
  }

  protected renderModals(): JSX.Element | null {
    const { showNewModal } = this.state;

    if (!showNewModal)
      return null;

    return (
      <NewQuestionModal
        onSubmitted={this.handleNewModalSubmitted}
        onHide={this.handleHideNewModal}
      />
    );
  }
}

function lastWhiteSpaceOf(str: string): number {
  for (let i: number = str.length - 1; i >= 0; i--)
    if (' \t\n\r\v'.indexOf(str[i]) > -1)
      return i;

  return -1;
}

function truncate(str: string, n = 80, useWordBoundary: boolean = true): string {
  if (str.length <= n)
    return str;

  const subString = str.substr(0, n - 1); // the original check

  return (useWordBoundary ? subString.substr(0, lastWhiteSpaceOf(subString)) : subString) + '...';
}
