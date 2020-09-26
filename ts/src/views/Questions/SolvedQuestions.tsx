import Questions from './Questions';
import { QuestionStatus } from './Question';

export default class SolvedQuestions extends Questions {
  protected getTitle(): string {
    return 'Uusimmat ratkaisut';
  }

  protected getStatus(): QuestionStatus | undefined {
    return QuestionStatus.Solved;
  }
}
