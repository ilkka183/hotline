import BaseForm from '../BaseForm';
import { FUEL_TYPE_TEXTS } from '../Questions/Question';
import { API_MODELS } from './ModelsTable';

export default class ModelForm extends BaseForm<{}> {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addField('MakeId',        'Merkki',               'number', { required: true, lookupUrl: 'Makes' });
    this.addField('Name',          'Malli',                'text',   { required: true });
    this.addField('StartYear',     'Vuodesta',             'number', { required: true });
    this.addField('EndYear',       'Vuoteen',              'number');
    this.addField('FuelType',      'Käyttövoima',          'number', { required: true, enums: FUEL_TYPE_TEXTS });
    this.addField('EngineSize',    'Kuutiotilavuus (cm3)', 'number', { required: true });
    this.addField('CylinderCount', 'Sylinterimäärä',       'number');
    this.addField('Tune',          'Katalysaattori',       'text');
    this.addField('EnginePower',   'Teho (kW)',            'number');
    this.addField('EnginePowerAt', 'Teho (r/min)',         'number');
    this.addField('EngineCode',    'Moottorin koodi',      'text');
    this.addField('MID',           'MID',                  'text');
    this.addField('NetWeight',     'Omamassa (kg)',        'number');
    this.addField('GrossWeight',   'Kokinaismassa (kg)',   'number');
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
