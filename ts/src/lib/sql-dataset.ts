import axios from 'axios';
import { Dataset, Field, RestDatabase, SelectOption } from './dataset';


class SqlDataset extends Dataset {

  constructor(database: RestDatabase) {
    super(database);
  }

  public get tableName(): string | null {
    return null;
  }

  public async getLookupText(sql: string, id: any) {
    sql += ' WHERE Id=?';

    const response = await axios.get(this.database.url + 'lookup/text', { params: { sql, id } });

    if (response.data.length > 0)
      return response.data[0].Text;

    return undefined;
  }

  public async getLookupList(sql: string) {
    sql += ' ORDER BY Text';

    const response = await axios.get(this.database.url + 'lookup/list', { params: { sql } });
    const list = [];

    for (const item of response.data)
      list.push(new SelectOption(item.Id, item.Text));

    return list;
  }
}

export abstract class SqlTable extends SqlDataset {
  public name: string;
  public sql: string = '';
  
  constructor(database: RestDatabase, name: string) {
    super(database);

    this.name = name;
  }

  get tableName(): string {
    return this.name;
  }

  get url(): string {
    return this.database.url + 'table/' + this.name;
  }

  public abstract getListCaption(): string;
  public abstract getAddCaption(): string;
  public abstract getEditCaption(): string;
  public abstract getDeleteCaption(): string;

  async getRow(query: any) {
    let url = this.url + '/row';
    let params = '';

    for (const key of Object.keys(query)) {
      if (params == '')
        params += '?';
      else
        params += '&';

      params += key + '=' + query[key];
    }

    url += params;

    console.log('GET ' + url);

    const response = await axios.get(url);

    const source = response.data[0];
    const row: any = {};

    for (const key in source) {
      row[key] = source[key];
    }

    return row;
  }

  async getQueryRows(pageNumber = 1) {
    let url = this.database.url + 'query/rows';
    url += '?table=' + this.tableName;
    url += '&sql=' + this.sql;
    url += '&limit=' + this.pageLimit;

    if (pageNumber > 1)
       url += '&offset=' + (pageNumber - 1)*this.pageLimit;

    console.log('GET ' + url);

    const response = await axios.get(url)
    const rows = [];

    for (const source of response.data.rows) {
      const row: any = {};

      for (const key in source) {
        row[key] = source[key];
      }

      rows.push(row);
    }

    return { rowCount: response.data.rowCount, rows }
  }
  
  async getTableRows(pageNumber = 1) {
    let url = this.url + '/rows?limit=' + this.pageLimit;

    if (pageNumber > 1)
       url += '&offset=' + (pageNumber - 1)*this.pageLimit;

    console.log('GET ' + url);

    const response = await axios.get(url)
    const rows = [];

    for (const source of response.data.rows) {
      const row: any = {};

      for (const key in source) {
        row[key] = source[key];
      }

      rows.push(row);
    }

    return { rowCount: response.data.rowCount, rows }
  }

  async getRows(pageNumber = 1) {
    if (this.sql)
      return this.getQueryRows(pageNumber);
    else
      return this.getTableRows(pageNumber);
  }

  async addRow(row: any) {
    const fields: any = {};

    for (const key in row) {
      const value = row[key];

      if (value !== null)
        fields[key] = value;
    }

    const url = this.url;
    console.log('POST ' + url);
    console.log(fields);

    const response = await axios.post(url, fields);
    const field: Field | null = this.primaryKeyField;

    if (field)
      row[field.name] = response.data.insertId;

    return response.data.insertId;
  }
  
  async updateRow(oldRow: any, newRow: any) {
    const keys = this.primaryKeys(newRow);

    const fields: any = {};

    for (const key in newRow) {
      const value = newRow[key];
      
      if (value != oldRow[key])
        fields[key] = value;
    }

    const url = this.url;
    console.log('PUT ' + url);
    console.log(fields);
    console.log(keys);

    await axios.put(url, fields, { params: keys });
  }

  async deleteRow(row: any) {
    const keys = this.primaryKeys(row);

    const url = this.url;
    console.log('DELETE ' + url);
    console.log(keys);

    await axios.delete(url, { params: keys });
  }

  confirmDeleteRow(row: any) {
    return confirm(`${this.getDeleteCaption()} (${this.contentCaptionOf(row)})?`);
  }

  navigateAdd(router: any) {
    router.push(this.tableName);
  }

  navigateOpen(router: any, row: any) {
    const query = this.primaryKeys(row);
    router.push({ path: this.tableName, query });
  }

  navigateEdit(router: any, row: any) {
    const query = this.primaryKeys(row);
    router.push({ path: this.tableName, query });
  }
}
