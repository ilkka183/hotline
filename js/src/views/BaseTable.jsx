import queryString from 'query-string';
import FieldsTable from '../components/common/FieldsTable';
import auth from '../services/authService';
import http from '../services/httpService';

const SHOW_IDS = false;

export default class BaseTable extends FieldsTable {
  user = auth.getCurrentUser();

  get apiPath() {
    return '/' + this.getApiName();
  }

  getItemsQuery(query) {
  }

  async getItems(options) {
    let { pageIndex, sortField } = options;
    const { pageSize } = this.state;

    let query = {}
    this.getItemsQuery(query);
    query.pageIndex = pageIndex;
    query.pageSize = pageSize;

    if (sortField.name) {
      query.sortName = sortField.name;

      if (sortField.order === 'desc')
        query.sortOrder = sortField.order;
    }

    let endpoint = this.apiPath;

    if (Object.keys(query).length > 0)
      endpoint += '?' + queryString.stringify(query);

    console.log(endpoint);

    return await http.get(endpoint);
  }

  async deleteItem(item) {
    const endpoint = this.apiPath + '/' + item.Id;

    await http.delete(endpoint);
  }

  addId(visible = SHOW_IDS) {
    this.addField('Id', 'No', 'number', { editLink: true, visible });
  }

  addName(name = 'Name', label = 'Nimi') {
    this.addField(name, label, 'text', { editLink: true });
  }

  addEnabled() {
    this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }
}
