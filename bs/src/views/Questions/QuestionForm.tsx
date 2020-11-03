import React from 'react';
import BaseForm from '../BaseForm';
import { FUEL_TYPE_TEXTS, STATUS_TEXTS } from './Question';

interface Props {
}

export default class QuestionForm extends BaseForm<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('Date',               'Pvm',                  'datetime', { required: true, readonly: true, visible: this.isPowerOrAdmin });
    this.addField('UserId',             'Lähettäjä',            'number',   { required: true, readonly: true, lookupUrl: 'user', show: row => this.showUser(row) });
    this.addField('Make',               'Merkki',               'text',     { required: true });
    this.addField('Model',              'Malli',                'text');
    this.addField('ModelYear',          'Vuosimalli',           'number');
    this.addField('ModelBeginYear',     'Vuodesta',             'number');
    this.addField('ModelEndYear',       'Vuoteen',              'number');
    this.addField('RegistrationYear',   'Rekisteröintivuosi',   'number');
    this.addField('RegistrationNumber', 'Rekisterinumero',      'text',     { visible: this.isPowerOrAdmin });
    this.addField('FuelType',           'Käyttövoima',          'number',   { enums: FUEL_TYPE_TEXTS });
    this.addField('CylinderCount',      'Sylinterimäärä',       'number');
    this.addField('EnginePower',        'Teho (kW)',            'number');
    this.addField('EngineSize',         'Kuutiotilavuus (cm3)', 'number');
    this.addField('EngineCode',         'Moottorin tunnus',     'text');
    this.addField('MID',                'MID',                  'text');
    this.addField('VIN',                'VIN',                  'text');
    this.addField('KType',              'KType',                'number');
    this.addField('NetWeight',          'Omamassa (kg)',        'number');
    this.addField('GrossWeight',        'Kokonaismassa (kg)',   'number');
    this.addField('Info',               'Lisätietoja',          'textarea', { rows: 3 });
    this.addField('Tags',               'Tunnisteet',           'textarea', { rows: 6 });
    this.addField('Title',              'Otsikko',              'text',     { required: true });
    this.addField('Description',        'Kuvaus',               'textarea', { required: true, renderText: text => QuestionForm.renderText(text), rows: 10 });
    this.addField('DescriptionFile',    'Liite',                'tex',      { readonly: true });
    this.addField('Solution',           'Ratkaisu',             'textarea', { rows: 10 });
    this.addField('SolutionFile',       'Liite',                'tex',      { readonly: true });
    this.addField('SolutionDate',       'Pvm',                  'datetime', { readonly: true, visible: this.isPowerOrAdmin });
    this.addField('Status',             'Tila',                 'number',   { required: true, getDefaultValue: () => 0, enums: STATUS_TEXTS });
    this.addConverted();

    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return 'question';
  }

  protected getInsertTitle(): string {
    return 'Lisää vikatapaus';
  }

  protected getUpdateTitle(): string {
    return 'Muokkaa vikatapausta';
  }

  protected getDeleteTitle(): string {
    return 'Poista vikatapaus';
  }

  private showUser(row: any): boolean {
    return this.owns(row.UserId);
  }

  public static renderText(text: string): JSX.Element | null {
    function addLine(index: number) {
      if (line.length > 0) {
        if (heading)
          buffer.push(<div className="question-section" key={index}>{line}</div>);
        else
          buffer.push(<div className="question-text" key={index}>{line}</div>);
      }
    }

    const buffer: JSX.Element[] = [];

    let line = '';
    let heading = false;
    let index = 0;

    for (let i = 0; i< text.length; i++) {
      const c = text[i];

      if ((c === '\r') || (c === '\n')) {
        addLine(index++);
        line = '';
        heading = false;
      } else {
        heading = c === ':';
        line += c;
      }
    }

    addLine(index);

    return <div>{buffer}</div>;
  }
}
