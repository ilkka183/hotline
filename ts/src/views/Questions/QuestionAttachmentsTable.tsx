import BaseTable from '../BaseTable';
import QuestionAttachmentForm from './QuestionAttachmentForm';

interface Props {
  question: any
}

export default class QuestionAttachmentsTable extends BaseTable<Props> {
  constructor(props: any) {
    super(props);

    this.addId();
    this.addField('QuestionId',  'Vikatapaus', 'number',   { visible: false });
    this.addField('FileName',    'Tiedosto',   'text',     { link: () => '/attachment' });
    this.addField('FileType',    'Tyyppi',     'text',     { editLink: true});
//    this.addField('Content',     'Sisältö',    'text');
    this.addField('Description', 'Kuvaus',     'textarea', { editLink: true});
  }

  protected getTitle(): string {
    return 'Liitteet';
  }

  protected getApiName(): string {
    return 'questionattachments';
  }

  protected getModalForm(): any {
    return QuestionAttachmentForm;
  }

  protected getParent(): any {
    return this.props.question;
  }
}
