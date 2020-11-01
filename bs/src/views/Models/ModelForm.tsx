import BaseForm from '../BaseForm';
import { FUEL_TYPE_TEXTS } from '../Questions/Question';
import { API_MODELS } from './ModelsTable';

export default class ModelForm extends BaseForm<{}> {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addField('MakeId',         'Merkki',               'number', { required: true, lookupUrl: 'Makes' });
    this.addField('Name',           'Malli',                'text',   { required: true });
    this.addField('AdditionalInfo', 'Tarkenne',             'text');
    this.addField('Grouping',       'Ryhmitys',             'text');
    this.addField('Sequence',       'Jakso',                'text');
    this.addField('Tune',           'Katalysaattori',       'text');
    this.addField('StartYear',      'Vuodesta',             'number', { required: true });
    this.addField('EndYear',        'Vuoteen',              'number');
    this.addField('FuelType',       'Käyttövoima',          'number', { required: true, enums: FUEL_TYPE_TEXTS });
    this.addField('EngineSize',     'Kuutiotilavuus (cm3)', 'number', { required: true });
    this.addField('CylinderCount',  'Sylinterimäärä',       'number');
    this.addField('EnginePower',    'Teho (kW)',            'number');
    this.addField('EnginePowerAt',  'Teho (r/min)',         'number');
    this.addField('EngineTorque',   'Vääntö (Nm)',          'number');
    this.addField('EngineTorqueAt', 'Vääntö (r/min)',       'number');
    this.addField('EngineCode',     'Moottorin koodi',      'text');
    this.addField('MID',            'MID',                  'text');
    this.addField('NetWeight',      'Omamassa (kg)',        'number');
    this.addField('GrossWeight',    'Kokonaismassa (kg)',   'number');
    this.addField('VehicleType',    'Ajoneuvotyyppi',       'number');
    this.addTimestamps();
    this.addEnabled();
    
    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return API_MODELS;
  }

  protected getInsertTitle(): string {
    return 'Lisää uusi automalli';
  }

  protected getUpdateTitle(): string {
    return 'Muokkaa automallia';
  }

  protected getDeleteTitle(): string {
    return 'Poista automalli';
  }
}
