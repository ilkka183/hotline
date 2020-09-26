import React from 'react';
import QuestionsTable from './QuestionsTable';
import UserComponent from '../UserComponent';
import { QuestionStatus } from './Question';

export default abstract class Questions extends UserComponent<{}, {}> {
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

  protected getStatus(): QuestionStatus | undefined {
    return undefined;
  }

  protected getUserId(): number | undefined {
    return undefined;
  }

  public render(): JSX.Element | null {
    if (!this.user)
      return null;

    return (
      <QuestionsTable
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
