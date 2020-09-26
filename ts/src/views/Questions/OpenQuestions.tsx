import Questions from './Questions';
import { QuestionStatus } from './Question';

export default class OpenQuestions extends Questions {

  protected getTitle(): string {
    return 'Avoimet vikatapaukset';
  }

  protected getStatus(): QuestionStatus | undefined {
    return QuestionStatus.Open;
  }
}
