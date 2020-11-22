import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Pagination } from '../../components/common/FieldsTable';
import QuestionsTable from './QuestionsTable';
import UserComponent from '../UserComponent';
import { QuestionStatus } from './Question';

export const TESTING = false;

function parseQuery(queryString: string) {
  var query: any = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');

  for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }

  return query;
}

export default abstract class Questions extends UserComponent<RouteComponentProps<{}>, {}> {

  protected abstract getTitle(): string;

  protected getCreatable(): boolean {
    return TESTING;
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

  protected renderTable(): JSX.Element {
    const query = parseQuery(this.props.location.search);
    const page: number = query.page ? parseInt(query.page) : 1;

    return (
      <QuestionsTable
        title={this.getTitle()}
        status={this.getStatus()}
        userId={this.getUserId()}
        newButtonText="Lisää uusi vikatapaus"
        pagination={Pagination.Bottom}
        routedPages={true}
        history={this.props.history}
        location={this.props.location}
        pageIndex={page - 1}
        creatable={this.getCreatable()}
        editable={this.getEditable()}
        deletable={this.getDeletable()}
      />
    );
  }

  public render(): JSX.Element | null {
    if (this.user)
      return this.renderTable();

    return null;
  }
}
