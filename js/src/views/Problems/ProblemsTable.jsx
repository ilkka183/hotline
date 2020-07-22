import React from 'react';
import BaseTable from '../BaseTable';
//import http from '../../services/httpService';

export const FUEL_TYPES = ['bensiini', 'diesel', 'bensiinihybridi', 'dieselhybridi', 'kaasu', 'sähkö'];
export const STATUSES = ['avoin', 'ratkaistu', 'ratkaisematon'];

export default class ProblemsTable extends BaseTable {
  constructor() {
    super();

    this.addId();
    this.addField('Date',        'Pvm',                  'datetime', { displayFormat: 'date' });
    this.addField('UserName',    'Lähettäjä',            'text',     { visible: false });
    this.addField('Make',        'Merkki',               'text');
    this.addField('Model',       'Malli',                'text');
    this.addField('ModelYear',   'Vuosimalli',           'number');
    this.addField('FuelType',    'Käyttövoima',          'number',   { enums: FUEL_TYPES });
    this.addField('Title',       'Otsikko',              'text',     { link: item => '/problem/' + item.Id });
    this.addField('Description', 'Kuvaus ja vastaukset', 'text',     { render: this.renderDescription });
    this.addField('Status',      'Tila',                 'number',   { render: this.renderStatus });
  }

  getTitle() {
    return 'Vikatapaukset';
  }

  getApiName() {
    return 'problems';
  }

  getItemsEndpoint(path) {
    let url = path;

    if (this.props.status !== undefined)
      url += '?Status=' + this.props.status;

    return url;
  }

  canDelete(row) {
    return (this.user.role <= 1 || row.UserId === this.user.id);
  }

  renderDescription(row) {
    return (
      <>
        <div className="description">
          {row.Description}
        </div>
        {row.Solution && <div>{row.Solution}</div>}
        {!row.Solution && row.Replies.map((reply, index) => <div key={index}>{reply.Message}</div>)}
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
}
