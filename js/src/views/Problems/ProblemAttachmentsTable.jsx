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

  getApiName() {
    return 'problemattachments';
  }

  getTitle() {
    return 'Liitteet';
  }

  getForm() {
    return ProblemAttachmentForm;
  }

  getParentId() {
    return this.props.problemId;
  }

  getNewButtonLink() {
    return `/${this.getApiName()}/new?ProblemId=${this.props.problemId}`;
  }
}
