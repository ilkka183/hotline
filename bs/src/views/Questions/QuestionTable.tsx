import BaseTable from '../BaseTable';
import QuestionForm from './QuestionForm';

export default class QuestionTable extends BaseTable<{}> {
  constructor(props: any) {
    super(props);

    this.addField('Id',          'No',               'number');
    this.addField('Date',        'Pvm',              'datetime');
    this.addField('UserName',    'Lähettäjä',        'text');
    this.addField('Make',        'Merkki',           'text');
    this.addField('Model',       'Malli',            'text');
    this.addField('ModelYear',   'Vuosimalli',       'number');
    this.addField('FuelType',    'Käyttövoima',      'number');
    this.addField('EngineCode',  'Moottorin tunnus', 'text');
    this.addField('VIN',         'VIN',              'text');
    this.addField('MID',         'MID',              'text');
    this.addField('Title',       'Otsikko',          'text');
    this.addField('Status',      'Tila',             'number');
    this.addField('Converted',   'Konvertoitu',      'boolean');
  }

  public getTitle(): string {
    return 'Vikatapaukset';
  }

  public getApiName(): string {
    return 'question';
  }

  public getModalForm(): any {
    return QuestionForm;
  }  
}
