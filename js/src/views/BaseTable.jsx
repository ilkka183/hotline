import FieldsTable from '../components/common/FieldsTable';

const SHOW_IDS = true;

export default class BaseTable extends FieldsTable {
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
