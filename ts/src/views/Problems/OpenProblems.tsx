import Problems from './Problems';
import { ProblemStatus } from './Problem';

export default class OpenProblems extends Problems {

  protected getTitle(): string {
    return 'Avoimet vikatapaukset';
  }

  protected getStatus(): ProblemStatus | undefined {
    return ProblemStatus.Open;
  }
}
