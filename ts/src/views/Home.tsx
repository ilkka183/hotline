import Problems from './Problems/Problems';

export default class Home extends Problems {
  protected getTitle(): string {
    return 'Vikatapaukset';
  }

  protected getCreatable(): boolean {
    return true;
  }
}
