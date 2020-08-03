import React from 'react';
import { Link } from 'react-router-dom';
import BaseTable from '../BaseTable';
import ProblemForm from './ProblemForm';
import NewProblemModal from './New/NewProblemModal';

export const FUEL_TYPES = ['bensiini', 'diesel', 'bensiinihybridi', 'dieselhybridi', 'kaasu', 'sähkö'];
export const STATUSES = ['avoin', 'ratkaistu', 'ratkaisematon'];

export default class ProblemsTable extends BaseTable {
  constructor() {
    super();

    this.state.showNewModal = false;

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

  getTitle() {
    return 'Vikatapaukset';
  }

  getApiName() {
    return 'problems';
  }

  getForm() {
    return ProblemForm;
  }  

  getItemsQuery(query) {
    if (this.props.status !== undefined)
      query.Status = this.props.status;
  }

  canDelete(row) {
    return (this.user.role <= 1 || row.UserId === this.user.id);
  }

  renderDescription(row) {
    return (
      <>
        <Link to={'/problem/' + row.Id}>{row.Title}</Link>
        <div className="description1">
          {row.Description}
        </div>
        {row.Solution && <div>{row.Solution}</div>}
        {!row.Solution && row.Replies.map((reply, index) => <div key={index}>- {reply.Message}</div>)}
      </>
    );
  }

  renderStatus(row) {
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

  renderModals() {
    const { showNewModal } = this.state;

    if (!showNewModal)
      return null;

    return (
      <NewProblemModal onSubmit={this.handleSubmitNewModal} onHide={this.handleHideNewModal} />
    );
  }
}
