import React from 'react';
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

  protected isRowDisabled(row: any): boolean {
    return row.Enabled !== undefined ? !row.Enabled : false;
  }  

  protected getItemsQuery(query: any) {
  }

  protected async getItems(options: SearchOptions): Promise<Rows> {
    const sortFields: any = options.sortFields;

    console.log(options);

    let query: any = {}
    this.getItemsQuery(query);
    query.pageIndex = options.pageIndex;
    query.pageSize = options.pageSize;

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
        if (searchValues[key]) {
          const field = this.findField(key);

          if (field) {
            let name = 'filter_';

            if (field.isString)
              name += 'string_';
            else
              name += 'number_';

            name += key;
  
            query[name] = searchValues[key];
          }
        }
    }

    let endpoint: string = this.apiPath;

    if (Object.keys(query).length > 0)
      endpoint += '?' + queryString.stringify(query);

    console.log(endpoint);

    const response: any = await http.get(endpoint);

    return response.data;
  }

  protected addId(visible: boolean = false): Field {
    return this.addField('Id', 'No', 'number', { visible });
  }

  protected addName(name: string = 'Name', label: string = 'Nimi'): Field {
    return this.addField(name, label, 'text', { search: true });
  }

  protected addEnabled(): Field {
    return this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }

  protected addConverted(): Field {
    return this.addField(
      'Converted',
      'Konvertoitu',
      'boolean',
      { required: true, visible: this.isPowerOrAdmin, search: true, render: this.renderConverted, getDefaultValue: () => false });
  }

  private renderConverted(row: any): JSX.Element {
    const classNames = ['false', 'true'];
    const TEXTS = ['ei', 'kyllä'];
    
    return <span className={classNames[row.Converted]}>{TEXTS[row.Converted]}</span>
  }
}
