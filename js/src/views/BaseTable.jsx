import FieldsTable from '../components/common/FieldsTable';
import { apiUrl } from '../config.json';
import http from '../services/httpService';

const SHOW_IDS = true;

export default class BaseTable extends FieldsTable {
  get apiPath() {
    return apiUrl + '/' + this.getApiName();
  }

  getItemsEndpoint(path) {
    return path;
  }

  deleteItemEndpoint(path, item) {
    return path + '/' + item.Id;
  }

  async getItems() {
    const endpoint = this.getItemsEndpoint(this.apiPath);
    
    return await http.get(endpoint);
  }

  async deleteItem(item) {
    const endpoint = this.deleteItemEndpoint(this.apiPath, item);

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
