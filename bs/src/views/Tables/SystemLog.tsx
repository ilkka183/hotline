import BaseTable from '../BaseTable';

const NAME = 'systemlog';


export class SystemLogsTable extends BaseTable<{}> {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addField('Timestamp', 'Aikaleima', 'datetime');
    this.addField('Level',     'Taso',      'text');
    this.addField('Message',   'Viesti',    'text');
    this.addField('Stack',     'Pino',      'textarea', { code: true });
  }

  protected getTitle(): string {
    return 'Virheloki';
  }

  protected getDefaultPageSize(): number {
    return 5;
  }

  protected getApiName(): string {
    return NAME;
  }

  protected getModalForm(): any {
    return null;
  }
}
