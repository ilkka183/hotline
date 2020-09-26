import BaseTable from '../BaseTable';
import ModelForm from './ModelForm';
import { FUEL_TYPE_TEXTS } from '../Questions/Question';

export const API_MODELS = 'models';

interface Props {
}

export default class ModelsTable extends BaseTable<Props> {
  constructor(props: Props) {
    super(props);

    this.addId(false);
    this.addField('MakeName',      'Merkki',               'text',   { editLink: true});
    this.addField('Name',          'Malli',                'text',   { editLink: true});
    this.addField('BeginYear',     'Vuodesta',             'number');
    this.addField('EndYear',       'Vuoteen',              'number');
    this.addField('FuelType',      'Käyttövoima',          'number', { enums: FUEL_TYPE_TEXTS });
    this.addField('EngineSize',    'Kuutiotilavuus (cm3)', 'number');
    this.addField('CylinderCount', 'Sylinterimäärä',       'number');
    this.addField('EnginePower',   'Teho (kW)',            'number');
    this.addField('EngineCode',    'Moottorin koodi',      'text');
    this.addField('MID',           'MID',                  'text');
    this.addEnabled();
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
