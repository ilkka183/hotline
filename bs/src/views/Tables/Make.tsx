import BaseTable from '../BaseTable';
import BaseForm from '../BaseForm';

const NAME = 'make';


abstract class AbstractMakeTable extends BaseTable<{}> {
  protected getTitle(): string {
    return 'Automerkit';
  }

  protected getApiName(): string {
    return NAME;
  }

  protected getModalForm(): any {
    return MakeForm;
  }
}


export class MakeTable extends AbstractMakeTable {
  constructor(props: any) {
    super(props);

    this.addField('Id',         'No',          'number');
    this.addField('Name',       'Nimi',        'text');
    this.addField('Info',       'Lisätietoja', 'text');
    this.addField('Enabled',    'Voimassa',    'boolean');
    this.addField('InsertedAt', 'Lisätty',     'datetime');
    this.addField('UpdatedAt',  'Päivitetty',  'datetime');
  }
}


export class MakesTable extends AbstractMakeTable {
  constructor(props: any) {
    super(props);

    this.addId(true);
    this.addName();
    this.addField('Info', 'Lisätietoja', 'text');
  }
}


export default class MakeForm extends BaseForm<{}> {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addField('Name', 'Nimi',        'text',     { required: true });
    this.addField('Info', 'Lisätietoja', 'textarea', { rows: 5 });
    this.addTimestamps();
    this.addEnabled();
    
    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return NAME;
  }

  protected getInsertTitle(): string {
    return 'Lisää uusi automerkki';
  }

  protected getUpdateTitle(): string {
    return 'Muokkaa automerkkiä';
  }

  protected getDeleteTitle(): string {
    return 'Poista automerkki';
  }
}
