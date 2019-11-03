import axios from 'axios';
import { Data, Dataset, SelectOption } from './dataset';


class SqlDataset extends Dataset {
  constructor(database) {
    super(database);
  }

  async getLookupText(sql, id) {
    sql += ' WHERE Id=?';

    const response = await axios.get(this.database.url + 'lookup/text', { params: { sql, id } });

    if (response.data.length > 0)
      return response.data[0].Text;

    return undefined;
  }

  async getLookupList(sql) {
    sql += ' ORDER BY Name';

    const response = await axios.get(this.database.url + 'lookup/list', { params: { sql } });
    const list = [];

    for (let item of response.data)
      list.push(new SelectOption(item.Id, item.Text));

    return list;
  }
}

export class SqlQuery extends SqlDataset {
  constructor(database, sql) {
    super(database);

    this.sql = sql;
  }

  get url() {
    return this.database.url + 'query/' + this.sql;
  }
}


export class SqlTable extends SqlDataset {
  constructor(database, name) {
    super(database);

    this.name = name;
  }

  get url() {
    return this.database.url + 'table/' + this.name;
  }

  async getRows(pageNumber = 1) {
    let url = this.url;
    url += '?' + 'limit=' + this.pageLimit

    if (pageNumber > 1)
       url += '&' + 'offset=' + (pageNumber - 1)*this.pageLimit;

    console.log('GET ' + url);

    const response = await axios.get(url)
    const rows = [];

    for (let source of response.data.rows) {
      const row = {};

      for (let key in source) {
        row[key] = new Data(source[key]);
      }

      rows.push(row);
    }

    for (let row of rows)
      for (let field of this.fields)
        field.findLookupText(row[field.name]);

    return { rowCount: response.data.rowCount, rows }
  }

  async addRow(row) {
    const fields = {};

    for (let key in row) {
      const value = row[key].value;

      if (value !== null)
        fields[key] = value;
    }

    const url = this.url;
    console.log('POST ' + url);
    console.log(fields);

    const response = await axios.post(url, fields);
    const field = this.primaryKeyField;

    if (field)
      row[field.name].value = response.data.insertId;

    return response.data.insertId;
  }

  async updateRow(oldRow, newRow) {
    const keys = this.primaryKeys(newRow);

    const fields = {};

    for (let key in newRow) {
      const value = newRow[key].value;
      
      if (value != oldRow[key].value)
        fields[key] = value;
    }

    const url = this.url;
    console.log('PUT ' + url);
    console.log(fields);
    console.log(keys);

    await axios.put(url, fields, { params: keys });
  }

  async deleteRow(row) {
    const keys = this.primaryKeys(row);

    const url = this.url;
    console.log('DELETE ' + url);
    console.log(keys);

    await axios.delete(url, { params: keys });
  }
}
