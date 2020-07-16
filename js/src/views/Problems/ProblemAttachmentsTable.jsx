import BaseTable from '../BaseTable';

export default class ProblemAttachmentsTable extends BaseTable {
  constructor() {
    super();

    this.addId();
    this.addField('ProblemId',   'Vikatapaus',   'number', { visible: false });
    this.addField('FileName',    'Tiedostonimi', 'text');
    this.addField('FileType',    'Tyyppi',       'text');
    this.addField('Content',     'Sisältö',      'text');
    this.addField('Description', 'Kuvaus',       'textarea');
  }

  getTitle() {
    return 'Liitteet';
  }

  getApiName() {
    return 'problemattachments';
  }

  getNewButtonLink() {
    return `/${this.getApiName()}/new?ProblemId=${this.props.problemId}`;
  }

  getItemsEndpoint(path) {
    return path + '?ProblemId=' + this.props.problemId;
  }
}
