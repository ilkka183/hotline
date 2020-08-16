import Problems from './Problems';

export default class UserProblems extends Problems {
  protected getTitle(): string {
    return 'Omat vikatapaukset';
  }

  protected getUserId(): number | undefined {
    return this.user!.id;
  }
}
