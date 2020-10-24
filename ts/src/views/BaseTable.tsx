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

  protected get isPowerOrAdmin(): boolean {
    return (this.user !== null) && this.user.isPowerOrAdmin;
  }

  protected owns(userId: number): boolean {
    return (this.user !== null) && this.user.owns(userId);
  }

  protected getItemsQuery(query: any) {
  }

  protected async getItems(options: SearchOptions): Promise<Rows> {
    const sortFields: any = options.sortFields;

    console.log(options);

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

    if (options.searchValues) {
      const searchValues: any = options.searchValues;

      for (const key in searchValues)
        if (searchValues[key])
          query[key] = searchValues[key];
    }

    let endpoint: string = this.apiPath;

    if (Object.keys(query).length > 0)
      endpoint += '?' + queryString.stringify(query);

    console.log(endpoint);

    const response: any = await http.get(endpoint);

    return response.data;
  }

  protected addId(visible: boolean = true): Field {
    return this.addField('Id', 'No', 'number', { editLink: this.isPowerOrAdmin, visible });
  }

  protected addName(name: string = 'Name', label: string = 'Nimi'): Field {
    return this.addField(name, label, 'text', { editLink: true, search: true });
  }

  protected addEnabled(): Field {
    return this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }
}
