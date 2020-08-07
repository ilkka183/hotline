import React from 'react';
import { Link } from 'react-router-dom';
import { FieldsTableProps } from '../../components/common/FieldsTable';
import BaseTable from '../BaseTable';
import ProblemForm from './ProblemForm';
import NewProblemModal from './New/NewProblemModal';

export const FUEL_TYPES = ['bensiini', 'diesel', 'bensiinihybridi', 'dieselhybridi', 'kaasu', 'sähkö'];
export const STATUSES = ['avoin', 'ratkaistu', 'ratkaisematon'];

function lastWhiteSpaceOf(str: string): number {
  for (let i = str.length - 1; i >= 0; i--)
    if (' \t\n\r\v'.indexOf(str[i]) > -1)
      return i;

  return -1;
}

function truncate(str: string, n = 80, useWordBoundary = true): string {
  if (str.length <= n)
    return str;

  const subString = str.substr(0, n - 1); // the original check

  return (useWordBoundary ? subString.substr(0, lastWhiteSpaceOf(subString)) : subString) + '...';
}

interface Props {
  status?: number
}

export default class ProblemsTable extends BaseTable<Props> {
  constructor(props: FieldsTableProps) {
    super(props);

    this.addId();
    this.addField('Date',        'Pvm',                  'datetime', { displayFormat: 'date' });
    this.addField('UserName',    'Lähettäjä',            'text',     { visible: false });
    this.addField('Make',        'Merkki',               'text',     { search: true });
    this.addField('Model',       'Malli',                'text',     { search: true });
    this.addField('ModelYear',   'Vuosimalli',           'number');
    this.addField('FuelType',    'Käyttövoima',          'number',   { enums: FUEL_TYPES });
    this.addField('EngineCode',  'Moottorin tunnus',     'text',     { visible: false, search: true });
//    this.addField('Title',       'Otsikko',              'text',     { search: true, link: item => '/problem/' + item.Id });
    this.addField('Description', 'Kuvaus ja vastaukset', 'text',     { search: true, render: this.renderDescription });
    this.addField('Status',      'Tila',                 'number',   { render: this.renderStatus });
  }

  public getTitle(): string {
    return 'Vikatapaukset';
  }

  public getApiName(): string {
    return 'problems';
  }

  public getForm(): any {
    return ProblemForm;
  }  

  protected getItemsQuery(query: any): void {
//    if (this.props.status !== undefined)
//      query.Status = this.props.status;
  }

  canDelete(row: any) {
    return (this.user.role <= 1 || row.UserId === this.user.id);
  }

  renderDescription(row: any) {
    return (
      <>
        <Link to={'/problem/' + row.Id}>{row.Title}</Link>
        <div className="description1">
          {truncate(row.Description)}
        </div>
        {row.Solution && <div>{truncate(row.Solution)}</div>}
        {!row.Solution && row.Replies.map((reply: any, index: number) => <div key={index}>- {truncate(reply.Message)}</div>)}
      </>
    );
  }

  renderStatus(row: any) {
    const text = STATUSES[row.Status];
    const className = row.Status === 0 ? 'open' : 'solved';

    return (
      <span className={className}>{text}</span>
    );
  }

  showNewModal() {
    this.setState({ showNewModal: true });
  }

  handleSubmitNewModal = async () => {
    await this.fetchItems({});

    this.setState({ showNewModal: false });
  }

  handleHideNewModal = () => {
    this.setState({ showNewModal: false });
  }

  protected renderModals(): JSX.Element | null {
    const { showNewModal } = this.state;

    if (!showNewModal)
      return null;

    return (
      <NewProblemModal onSubmit={this.handleSubmitNewModal} onHide={this.handleHideNewModal} />
    );
  }
}
