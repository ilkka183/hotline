import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import AppNavbar from './AppNavbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './views/Home';
import About from './views/About';
import NotFound from './views/NotFound';

import MakesTable from './views/Makes/MakesTable';
import ModelsTable from './views/Models/ModelsTable';
import UserGroupsTable from './views/UserGroups/UserGroupsTable';
import UsersTable from './views/Users/UsersTable';

import ProblemsTable from './views/Problems/ProblemsTable';
import Problem from './views/Problems/Problem';
import OpenProblems from './views/Problems/OpenProblems';
import SolvedProblems from './views/Problems/SolvedProblems';
import UserProblems from './views/Problems/UserProblems';

import Profile from './views/Profile/Profile';

import LoginForm from './views/Login/LoginForm';
import RegisterForm from './views/Login/RegisterForm';
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
            <ProtectedRoute path="/problem/:id" component={Problem} />
            <ProtectedRoute path="/problems/open" component={OpenProblems} />
            <ProtectedRoute path="/problems/solved" component={SolvedProblems} />
            <ProtectedRoute path="/problems/user" component={UserProblems} />
            <ProtectedRoute path="/problems" component={ProblemsTable} />
            <ProtectedRoute path="/usergroups" component={UserGroupsTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/users" component={UsersTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/makes" component={MakesTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/models" component={ModelsTable} requiredRole={UserRole.Power} />
            <ProtectedRoute path="/about" component={About} />
            <ProtectedRoute path="/profile" component={Profile} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
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
