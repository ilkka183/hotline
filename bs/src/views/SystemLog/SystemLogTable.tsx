import BaseTable from '../BaseTable';

export const API_SYSTEM_LOGS = 'systemlogs';

interface Props {
}

export default class SystemLogsTable extends BaseTable<Props> {
  constructor(props: Props) {
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

  protected getPageSize(): number {
    return 5;
  }

  protected getApiName(): string {
    return API_SYSTEM_LOGS;
  }

  protected getModalForm(): any {
    return undefined;
  }

  protected canUpdateRow(row: any): boolean {
    return false;
  }
}
