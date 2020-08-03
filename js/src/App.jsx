import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Container from 'react-bootstrap/Container'
import AppNavbar from './AppNavbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './views/Home';
import About from './views/About';
import NotFound from './views/NotFound';

import MakesTable from './views/Makes/MakesTable';
import ModelsTable from './views/Models/ModelsTable';
import UserGroupsTable from './views/UserGroups/UserGroupsTable';
import UsersTable, { POWER_ROLE } from './views/Users/UsersTable';

import ProblemsTable from './views/Problems/ProblemsTable';
import Problem from './views/Problems/Problem';
import OpenProblems from './views/Problems/OpenProblems';
import SolvedProblems from './views/Problems/SolvedProblems';

import ProfileForm from './views/Profile/ProfileForm';
import ChangePasswordForm from './views/Profile/ChangePasswordForm';

import LoginForm from './views/Login/LoginForm';
import RegisterForm from './views/Login/RegisterForm';
import Logout from './views/Login/Logout';

import auth from './services/authService';
import 'react-toastify/dist/ReactToastify.css';

export default class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <>
        <ToastContainer />
        <AppNavbar user={user} />
        <Container fluid>
          <Switch>
            <Route path="/home" component={Home} />
            <ProtectedRoute path="/problem/:id" component={Problem} />
            <ProtectedRoute path="/problems/open" component={OpenProblems} />
            <ProtectedRoute path="/problems/solved" component={SolvedProblems} />
            <ProtectedRoute path="/problems" component={ProblemsTable} />
            <ProtectedRoute path="/usergroups" component={UserGroupsTable} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/users" component={UsersTable} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/makes" component={MakesTable} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/models" component={ModelsTable} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/about" component={About} />
            <ProtectedRoute path="/profile" component={ProfileForm} />
            <ProtectedRoute path="/changepassword" component={ChangePasswordForm} />
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
