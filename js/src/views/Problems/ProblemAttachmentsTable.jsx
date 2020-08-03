import BaseTable from '../BaseTable';
import ProblemAttachmentForm from './ProblemAttachmentForm';

export default class ProblemAttachmentsTable extends BaseTable {
  constructor() {
    super();

    this.addId();
    this.addField('ProblemId',   'Vikatapaus', 'number',   { visible: false });
    this.addField('FileName',    'Tiedosto',   'text',     { link: () => '/attachment' });
    this.addField('FileType',    'Tyyppi',     'text',     { editLink: true});
//    this.addField('Content',     'Sisältö',    'text');
    this.addField('Description', 'Kuvaus',     'textarea', { editLink: true});
  }

  getTitle() {
    return 'Liitteet';
  }

  getApiName() {
    return 'problemattachments';
  }

  getForm() {
    return ProblemAttachmentForm;
  }

  getParentId() {
    return this.props.problemId;
  }
}
