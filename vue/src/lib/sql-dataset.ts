import { Dataset, Field, RestDatabase } from './dataset';


export abstract class SqlDataset extends Dataset
{
  constructor(database: RestDatabase) {
    super(database);
  }

  public async fetchLookupOptions(api: string) {
    const response = await this.axios.get('/lookup/' + api);
    const options = [];

    for (const item of response.data)
      options.push({ value: item.Id, text: item.Text });

    return options;
  }
}


export abstract class SqlTable extends SqlDataset {
  private readonly name: string;
  private readonly customApi: string;
  private readonly filter: object;
  
  constructor(database: RestDatabase, name: string, customApi: string, filter: object) {
    super(database);
    this.name = name;
    this.customApi = customApi;
    this.filter = filter;
  }

  public get tableName(): string {
    return this.name;
  }

  get url(): string {
    return '/table/' + this.name;
  }

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
    
    const response = await this.axios.get(url);

    const source = response.data[0];
    const row: object = {};

    for (const key in source) {
      row[key] = source[key];
    }

    return row;
  }

  private async fetchRows(url: string, pageNumber: number) {
    url += '?limit=' + this.rowsPerPage;

    if (pageNumber > 1)
      url += '&offset=' + (pageNumber - 1)*this.rowsPerPage;

    for (const name in this.fixedValues)
      url += '&' + name + '=' + this.fixedValues[name];

    if (this.filter)
      for (const name in this.filter)
        url += '&' + name + '=' + this.filter[name];

    console.log('GET ' + url);

    const response = await this.axios.get(url)
    const rows = [];

    for (const source of response.data.rows) {
      const row: object = {};

      for (const key in source)
        row[key] = source[key];

      rows.push(row);
    }

    return { rowCount: response.data.rowCount, rows }
  }

  private async getTableRows(pageNumber: number) {
    const url = '/table/' + this.name + '/rows';

    return this.fetchRows(url, pageNumber);
  }

  private getCustomRows(pageNumber: number) {
    const url = '/custom/' + this.customApi;

    return this.fetchRows(url, pageNumber);
  }

  public async getRows(pageNumber = 1) {
    if (this.customApi)
      return this.getCustomRows(pageNumber);
    else
      return this.getTableRows(pageNumber);
  }

  public async addRow(row: object) {
    const body: object = {};

    for (const key in row) {
      const value = row[key];

      if (value !== null)
        body[key] = value;
    }

    const url = this.url;
    console.log('POST ' + url);
    console.log('body', body);

    const response = await this.axios.post(url, body);
    const field: Field | null = this.primaryKeyField;

    if (field)
      row[field.name] = response.data.insertId;

    return response.data.insertId;
  }
  
  public async updateRow(oldRow: object, newRow: object) {
    const params = this.primaryKeys(oldRow);

    const body: object = {};

    for (const key in newRow) {
      const value = newRow[key];
      
      if (value != oldRow[key])
        body[key] = value;
    }

    const url = this.url;
    console.log('PUT ' + url, params);
    console.log('body', body);

    await this.axios.put(url, body, { params });
  }

  public async deleteRow(row: object) {
    const params = this.primaryKeys(row);

    const url = this.url;
    console.log('DELETE ' + url, params);

    await this.axios.delete(url, { params });
  }

  public confirmDeleteRow(row: object): boolean {
    return confirm(this.getDeleteCaption());
  }

  public get listCaption() {
    return this.getListCaption();
  }

  public get addCaption() {
    return this.getAddCaption();
  }

  public get editCaption() {
    return this.getEditCaption();
  }

  public get deleteCaption() {
    return this.getDeleteCaption();
  }

  protected abstract getListCaption(): string;
  protected abstract getAddCaption(): string;
  protected abstract getEditCaption(): string;
  protected abstract getDeleteCaption(): string;

  public navigateAdd(router: any) {
    console.log(this.tableName);
    router.push({ path: 'add/' + this.tableName, query: this.fixedValues });
  }

  public navigateEdit(router: any, row: object) {
    const query = this.primaryKeys(row);
    router.push({ path: 'edit/' + this.tableName, query });
  }

  public navigateOpen(router: any, row: object) {
    const query = this.primaryKeys(row);
    router.push({ path: 'open/' + this.tableName, query });
  }
}