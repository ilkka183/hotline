import React from 'react';
import LoginForm from './Login/LoginForm';
import Questions from './Questions/Questions';

export default class Home extends Questions {
  protected getTitle(): string {
    return 'Vikatapaukset';
  }

  protected getCreatable(): boolean {
    return true;
  }

  public renderLogin(): JSX.Element {
    return <LoginForm />
  }

  public render(): JSX.Element | null {
    if (this.user)
      return this.renderTable();
    else
      return this.renderLogin();
  }
}
