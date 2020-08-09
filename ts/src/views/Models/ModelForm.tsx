import BaseForm from '../BaseForm';
import { FUEL_TYPE_TEXTS } from '../Problems/Problem';
import { API_MODELS } from './ModelsTable';

interface Props {
}

export default class ModelForm extends BaseForm<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('MakeId',        'Merkki',               'number', { required: true, lookupUrl: 'Makes' });
    this.addField('Name',          'Malli',                'text',   { required: true });
    this.addField('BeginYear',     'Vuodesta',             'number', { required: true });
    this.addField('EndYear',       'Vuoteen',              'number');
    this.addField('FuelType',      'Käyttövoima',          'number', { required: true, enums: FUEL_TYPE_TEXTS });
    this.addField('EngineSize',    'Kuutiotilavuus (cm3)', 'number', { required: true });
    this.addField('CylinderCount', 'Sylinterimäärä',       'number', { required: true });
    this.addField('EnginePower',   'Teho (kW)',            'number', { required: true });
    this.addField('EngineCode',    'Moottorin koodi',      'text');
    this.addField('MID',           'MID',                  'text');
    this.addEnabled();
    this.addTimestamps();
    
    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return API_MODELS;
  }

  protected getNewTitle(): string {
    return 'Uusi automalli';
  }

  protected getEditTitle(): string {
    return 'Muokkaa automallia';
  }

  protected getDeleteTitle(): string {
    return 'Poista automalli';
  }
}
