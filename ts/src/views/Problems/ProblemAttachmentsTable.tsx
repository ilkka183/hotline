import BaseTable from '../BaseTable';
import ProblemAttachmentForm from './ProblemAttachmentForm';

interface Props {
  problemId: number
}

export default class ProblemAttachmentsTable extends BaseTable<Props> {
  constructor(props: Props) {
    super(props);

    this.addId();
    this.addField('ProblemId',   'Vikatapaus', 'number',   { visible: false });
    this.addField('FileName',    'Tiedosto',   'text',     { link: () => '/attachment' });
    this.addField('FileType',    'Tyyppi',     'text',     { editLink: true});
//    this.addField('Content',     'Sisältö',    'text');
    this.addField('Description', 'Kuvaus',     'textarea', { editLink: true});
  }

  protected getTitle(): string {
    return 'Liitteet';
  }

  protected getApiName(): string {
    return 'problemattachments';
  }

  protected getModalForm(): any {
    return ProblemAttachmentForm;
  }

  protected getParentId(): number | null {
    return this.props.problemId;
  }
}
