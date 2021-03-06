import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import AppNavbar from './AppNavbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './views/Home';
import About from './views/About';
import NotFound from './views/NotFound';

import { MakeTable, MakesTable } from './views/Tables/Make';
import { ModelTable, ModelsTable } from './views/Tables/Model';
import { UserGroupTable, UserGroupsTable } from './views/Tables/UserGroup';
import { UserTable, UsersTable } from './views/Tables/User';
import { UserSessionsTable } from './views/Tables/UserSession';
import { SystemLogsTable } from './views/Tables/SystemLog';

import Question from './views/Questions/Question';
import OpenQuestions from './views/Questions/OpenQuestions';
import SolvedQuestions from './views/Questions/SolvedQuestions';
import UserQuestions from './views/Questions/UserQuestions';
import QuestionTable from './views/Questions/QuestionTable';

import Profile from './views/Profile/Profile';
import Logout from './views/Login/Logout';

import { User, UserRole } from './services/authService';
import auth from './services/authService';

interface State {
  user: User | null
}
export default class App extends React.Component<{}, State> {
  public state = {
    user: null
  };

  public componentDidMount() {
    const user: User | null = auth.getCurrentUser();

    this.setState({ user });
  }

  public render(): JSX.Element {
    return (
      <>
        <AppNavbar user={this.state.user} />
        <Container fluid>
          <Switch>
            <Route path="/home" component={Home} />
            <ProtectedRoute path="/question/:id" component={Question} />
            <ProtectedRoute path="/questions/open" component={OpenQuestions} />
            <ProtectedRoute path="/questions/solved" component={SolvedQuestions} />
            <ProtectedRoute path="/questions/user" component={UserQuestions} />
            <ProtectedRoute path="/usergroups" component={UserGroupsTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/users" component={UsersTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/usersessions" component={UserSessionsTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/systemlog" component={SystemLogsTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/makes" component={MakesTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/models" component={ModelsTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/table/usergroups" component={UserGroupTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/table/users" component={UserTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/table/makes" component={MakeTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/table/models" component={ModelTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/table/questions" component={QuestionTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/about" component={About} />
            <ProtectedRoute path="/profile" component={Profile} />
            <Route path="/logout" component={Logout} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/home" />
            <Redirect to="/not-found" />
          </Switch>
        </Container>
      </>
    );
  }
}
