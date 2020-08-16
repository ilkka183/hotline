import Problems from './Problems';
import { ProblemStatus } from './Problem';

export default class SolvedProblems extends Problems {
  protected getTitle(): string {
    return 'Uusimmat ratkaisut';
  }

  protected getStatus(): ProblemStatus | undefined {
    return ProblemStatus.Solved;
  }
}
