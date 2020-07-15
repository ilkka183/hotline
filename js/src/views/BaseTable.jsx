import FieldsTable from '../components/common/FieldsTable';
import { apiUrl } from '../config.json';
import http from '../services/httpService';

const SHOW_IDS = true;

export default class BaseTable extends FieldsTable {
  get apiEndpoint() {
    return apiUrl + '/' + this.getApiName();
  }

  async getItems() {
    return await http.get(this.apiEndpoint);
  }

  async deleteItem(item) {
    await http.delete(this.apiEndpoint + '/' + item.Id)    
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
