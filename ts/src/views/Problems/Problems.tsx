import React from 'react';
import ProblemsTable from './ProblemsTable';
import UserComponent from '../UserComponent';
import { ProblemStatus } from './Problem';

export default abstract class Problems extends UserComponent<{}, {}> {
  protected abstract getTitle(): string;

  protected getCreatable(): boolean {
    return false;
  }

  protected getEditable(): boolean {
    return true;
  }

  protected getDeletable(): boolean {
    return (this.user !== null) && this.user?.isPowerOrAdmin;
  }

  protected getStatus(): ProblemStatus | undefined {
    return undefined;
  }

  protected getUserId(): number | undefined {
    return undefined;
  }

  public render(): JSX.Element | null {
    if (!this.user)
      return null;

    return (
      <ProblemsTable
        title={this.getTitle()}
        status={this.getStatus()}
        userId={this.getUserId()}
        newButtonAsLink={true}
        newButtonText="Lisää uusi vikatapaus"
        paginate={true}
        creatable={this.getCreatable()}
        editable={this.getEditable()}
        deletable={this.getDeletable()}
      />
    );
  }
}
