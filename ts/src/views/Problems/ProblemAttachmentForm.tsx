import BaseForm from '../BaseForm';

export default class ProblemAttachmentForm extends BaseForm {
  state = {
    data: {},
    errors: {}
  }

  constructor(props) {
    super(props);

    this.addId();
    this.addField('ProblemId',   'Vikatapaus',   'number',   { required: true, readonly: true, visible: false, getDefaultValue: () => props.parentId });
    this.addField('FileName',    'Tiedostonimi', 'text',     { required: true, readonly: true });
    this.addField('FileSize',    'Koko',         'number',   { required: true, readonly: true });
    this.addField('FileType',    'Tyyppi',       'text',     { required: true, readonly: true });
    this.addField('Content',     'Sisältö',      'file',     { required: true });
    this.addField('Description', 'Kuvaus',       'textarea', { required: true, rows: 10 });

    this.state.data = this.getEmptyData();
  }

  getApiName() {
    return 'problemattachments';
  }

  getNewTitle() {
    return 'Uusi liite';
  }

  getEditTitle() {
    return 'Muokkaa liitettä';
  }

  getDeleteTitle() {
    return 'Poista liite';
  }
}
