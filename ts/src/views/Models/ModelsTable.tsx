import BaseTable from '../BaseTable';
import ModelForm from './ModelForm';
import { FUEL_TYPE_TEXTS } from '../Questions/Question';

export const API_MODELS = 'models';

interface Props {
}

export default class ModelsTable extends BaseTable<Props> {
  constructor(props: any) {
    super(props);

    this.addId(true);
    this.addField('MakeName',       'Merkki',               'text');
    this.addField('Name',           'Malli',                'text');
    this.addField('AdditionalInfo', 'Tarkenne',             'text');
    this.addField('Grouping',       'Ryhmitys',             'text');
    this.addField('Sequence',       'Jakso',                'text');
    this.addField('Tune',           'Katalysaattori',       'text');
    this.addField('StartYear',      'Vuodesta',             'number');
    this.addField('EndYear',        'Vuoteen',              'number');
    this.addField('FuelType',       'Käyttövoima',          'number', { enums: FUEL_TYPE_TEXTS });
    this.addField('EngineSize',     'Kuutiotilavuus (cm3)', 'number');
    this.addField('EnginePower',    'Teho (kW)',            'number');
    this.addField('EnginePowerAt',  'Teho (r/min)',         'number');
    this.addField('EngineCode',     'Moottorin koodi',      'text');
    this.addField('MID',            'MID',                  'text');
    this.addField('VehicleType',    'Ajoneuvotyyppi',       'number');
  }

  protected getTitle(): string {
    return 'Automallit';
  }

  protected getApiName(): string {
    return API_MODELS;
  }

  protected getModalForm(): any {
    return ModelForm;
  }  
}
