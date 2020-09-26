import BaseForm from '../BaseForm';

interface Props {
  parent: any
}

export default class QuestionAttachmentForm extends BaseForm<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('QuestionId',  'Vikatapaus',   'number',   { required: true, readonly: true, visible: false, getDefaultValue: () => props.parent.Id });
    this.addField('FileName',    'Tiedostonimi', 'text',     { required: true, readonly: true });
    this.addField('FileSize',    'Koko',         'number',   { required: true, readonly: true });
    this.addField('FileType',    'Tyyppi',       'text',     { required: true, readonly: true });
    this.addField('Content',     'Sisältö',      'file',     { required: true });
    this.addField('Description', 'Kuvaus',       'textarea', { required: true, rows: 10 });

    this.state.data = this.getEmptyData();
  }

  protected getApiName(): string {
    return 'questionattachments';
  }

  protected getNewTitle(): string {
    return 'Uusi liite';
  }

  protected getEditTitle(): string {
    return 'Muokkaa liitettä';
  }

  protected getDeleteTitle(): string {
    return 'Poista liite';
  }
}
