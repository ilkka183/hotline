import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Container from 'react-bootstrap/Container'
import AppNavbar from './AppNavbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './views/Home';
import About from './views/About';
import NotFound from './views/Problems/NotFound';

import BrandsTable from './views/Brands/BrandsTable';
import BrandForm from './views/Brands/BrandForm';

import UserGroupsTable from './views/UserGroups/UserGroupsTable';
import UserGroupForm from './views/UserGroups/UserGroupForm';

import UsersTable from './views/Users/UsersTable';
import UserForm from './views/Users/UserForm';
import { POWER_ROLE } from './views/Users/UsersTable';

import ProblemsTable from './views/Problems/ProblemsTable';
import Problem from './views/Problems/Problem';
import ProblemForm from './views/Problems/ProblemForm';
import ProblemReplyForm from './views/Problems/ProblemReplyForm';
import NewProblemForm from './views/Problems/NewProblemForm';

import Profile from './views/Profile/Profile';

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
            <ProtectedRoute path="/problems/create" component={NewProblemForm} />
            <ProtectedRoute path="/problems/:id" component={ProblemForm} />
            <ProtectedRoute path="/problems" component={ProblemsTable} />
            <ProtectedRoute path="/problemreplies/:id" component={ProblemReplyForm} />
            <ProtectedRoute path="/usergroups/:id" component={UserGroupForm} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/usergroups" component={UserGroupsTable} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/users/:id" component={UserForm} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/users" component={UsersTable} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/brands/:id" component={BrandForm} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/brands" component={BrandsTable} requiredRole={POWER_ROLE} />
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
