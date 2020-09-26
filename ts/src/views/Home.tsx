import Questions from './Questions/Questions';

export default class Home extends Questions {
  protected getTitle(): string {
    return 'Vikatapaukset';
  }

  protected getCreatable(): boolean {
    return true;
  }
}
