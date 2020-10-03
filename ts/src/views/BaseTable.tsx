import queryString from 'query-string';
import { Field } from '../components/common/Fields';
import FieldsTable, { SearchOptions, Rows } from '../components/common/FieldsTable';
import auth, { User } from '../services/authService';
import http from '../services/httpService';

export default abstract class BaseTable<P> extends FieldsTable<P> {
  protected readonly user: User | null = auth.getCurrentUser();

  public get apiPath(): string {
    return '/' + this.getApiName();
  }

  protected owns(userId: number): boolean {
    return (this.user !== null) && this.user.owns(userId);
  }

  protected getItemsQuery(query: any) {
  }

  protected async getItems(options: SearchOptions): Promise<Rows> {
    const sortFields: any = options.sortFields;

    let query: any = {}
    this.getItemsQuery(query);
    query.pageIndex = options.pageIndex;
    query.pageSize = this.pageSize;

    if (sortFields.length > 0) {
      query.sortFields = sortFields.length;

      let number: number = 1;
  
      for (const sortField of sortFields) {
        query['sortName' + number] = sortField.name;
  
        if (sortField.order === 'desc')
          query['sortOrder' + number] = sortField.order;
  
        number++;
      }
    }

    let endpoint: string = this.apiPath;

    if (Object.keys(query).length > 0)
      endpoint += '?' + queryString.stringify(query);

    const response: any = await http.get(endpoint);

    return response.data;
  }

  protected async deleteItem(row: any) {
    const endpoint: string = this.apiPath + '/' + row.Id;

    await http.delete(endpoint);
  }

  protected addId(visible: boolean = true): Field {
    return this.addField('Id', 'No', 'number', { editLink: true, visible });
  }

  protected addName(name: string = 'Name', label: string = 'Nimi'): Field {
    return this.addField(name, label, 'text', { editLink: true });
  }

  protected addEnabled(): Field {
    return this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }
}
