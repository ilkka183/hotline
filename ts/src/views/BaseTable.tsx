import queryString from 'query-string';
import { Field } from '../components/common/Fields';
import FieldsTable, { SearchOptions, Rows } from '../components/common/FieldsTable';
import auth, { User } from '../services/authService';
import http from '../services/httpService';

const SHOW_IDS = false;

export default abstract class BaseTable<P> extends FieldsTable<P> {
  protected user: any = auth.getCurrentUser();

  public get apiPath(): string {
    return '/' + this.getApiName();
  }

  protected getItemsQuery(query: any): void {
  }

  protected async getItems(options: SearchOptions): Promise<Rows> {
    const { pageIndex } = options;
    const sortFields: any = options.sortFields;
    const { pageSize } = this.state;

    let query: any = {}
    this.getItemsQuery(query);
    query.pageIndex = pageIndex;
    query.pageSize = pageSize;

    if (sortFields.length > 0) {
      query.sortFields = sortFields.length;

      let number = 1;
  
      for (const sortField of sortFields) {
        query['sortName' + number] = sortField.name;
  
        if (sortField.order === 'desc')
          query['sortOrder' + number] = sortField.order;
  
        number++;
      }
    }

    let endpoint = this.apiPath;

    if (Object.keys(query).length > 0)
      endpoint += '?' + queryString.stringify(query);

    return await http.get(endpoint);
  }

  async deleteItem(row: any) {
    const endpoint = this.apiPath + '/' + row.Id;

    await http.delete(endpoint);
  }

  protected addId(visible: boolean = SHOW_IDS): Field {
    return this.addField('Id', 'No', 'number', { editLink: true, visible });
  }

  protected addName(name: string = 'Name', label: string = 'Nimi'): Field {
    return this.addField(name, label, 'text', { editLink: true });
  }

  protected addEnabled(): Field {
    return this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }
}
