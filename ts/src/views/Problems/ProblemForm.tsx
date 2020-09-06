import BaseForm from '../BaseForm';
import { FUEL_TYPE_TEXTS, STATUS_TEXTS } from './Problem';

interface Props {
}

export default class ProblemForm extends BaseForm<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('Date',               'Pvm',                  'datetime', { required: true, readonly: true, visible: this.hasPowerRights });
    this.addField('UserId',             'Lähettäjä',            'number',   { required: true, readonly: true, visible: this.hasPowerRights, lookupUrl: 'Users' });
    this.addField('Make',               'Merkki',               'text',     { required: true });
    this.addField('Model',              'Malli',                'text',     { required: true });
    this.addField('ModelYear',          'Vuosimalli',           'number');
    this.addField('ModelBeginYear',     'Vuodesta',             'number');
    this.addField('ModelEndYear',       'Vuoteen',              'number');
    this.addField('RegistrationYear',   'Rekisteröintivuosi',   'number',   { required: true });
    this.addField('RegistrationNumber', 'Rekisterinumero',      'text',     { visible: this.hasPowerRights });
    this.addField('FuelType',           'Käyttövoima',          'number',   { enums: FUEL_TYPE_TEXTS });
    this.addField('CylinderCount',      'Sylinterimäärä',       'number');
    this.addField('EnginePower',        'Teho (kW)',            'number');
    this.addField('EngineSize',         'Kuutiotilavuus (cm3)', 'number');
    this.addField('EngineCode',         'Moottorin tunnus',     'text');
    this.addField('MID',                'MID',                  'text');
    this.addField('VIN',                'VIN',                  'text');
    this.addField('TypeNumber',         'Tyyppinumero',         'number');
    this.addField('NetWeight',          'Omamassa (kg)',        'number');
    this.addField('GrossWeight',        'Kokonaismassa (kg)',   'number');
    this.addField('Info',               'Lisätietoja',          'textarea', { rows: 3 });
    this.addField('Title',              'Otsikko',              'text',     { required: true });
    this.addField('Description',        'Kuvaus',               'textarea', { required: true, preformatted: true, rows: 10 });
    this.addField('Solution',           'Ratkaisu',             'textarea', { preformatted: true, rows: 10 });
    this.addField('Status',             'Tila',                 'number',   { required: true, getDefaultValue: () => 0, enums: STATUS_TEXTS });

    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return 'problems';
  }

  protected getNewTitle(): string {
    return 'Uusi vikatapaus';
  }

  protected getEditTitle(): string {
    return 'Muokkaa vikatapausta';
  }

  protected getDeleteTitle(): string {
    return 'Poista vikatapaus';
  }
}
