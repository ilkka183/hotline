import DataForm from './DataForm';

const SHOW_IDS = true;

export default class BaseForm extends DataForm {
  get formattedTitle() {
    let title = this.getTitle();

    if (this.dataId === 'new')
      title += ' - uusi';

    return title;
  }

  getApiName() {
    throw new Error('You have to implement the method getApiName!');
  }

  addId(visible = SHOW_IDS) {
    this.addField('Id', 'No', 'number',  { primaryKey: true, readonly: true, visible });
  }

  addEnabled() {
    this.addField('Enabled', 'Voimassa', 'boolean', { required: true, getDefaultValue: () => true });
  }

  addTimestamps() {
    this.addField('CreatedAt', 'Luotu',    'datetime', { required: true, readonly: true, visibleInTable: false });
    this.addField('UpdatedAt', 'Muokattu', 'datetime', { readonly: true, visibleInTable: false });
  }  
}