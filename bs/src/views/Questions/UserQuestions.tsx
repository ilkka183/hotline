import Questions from './Questions';

export default class UserQuestions extends Questions {
  protected getTitle(): string {
    return 'Omat vikatapaukset';
  }

  protected getUserId(): number | undefined {
    return this.user!.id;
  }
}
