import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Container from 'react-bootstrap/Container'
import AppNavbar from './AppNavbar';
import ProtectedRoute from './components/common/ProtectedRoute';

import About from './views/About';
import Brands from './views/Brands';
import Logout from './views/Logout';
import Movies from './views/Movies';
import NotFound from './views/NotFound';
import Problems from './views/Problems';
import Profile from './views/Profile';
import UserGroups from './views/UserGroups';
import Users from './views/Users';

import BrandForm from './forms/BrandForm';
import LoginForm from './forms/LoginForm';
import MovieForm from './forms/MovieForm';
import ProblemForm from './forms/ProblemForm';
import RegisterForm from './forms/RegisterForm';
import UserForm from './forms/UserForm';
import UserGroupForm from './forms/UserGroupForm';

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
            <ProtectedRoute path="/movies/:id" component={MovieForm} />
            <Route path="/movies" component={Movies} />
            <ProtectedRoute path="/problems/:id" component={ProblemForm} />
            <Route path="/problems" component={Problems} />
            <ProtectedRoute path="/usergroups/:id" component={UserGroupForm} />
            <Route path="/usergroups" component={UserGroups} />
            <ProtectedRoute path="/users/:id" component={UserForm} />
            <Route path="/users" component={Users} />
            <ProtectedRoute path="/brands/:id" component={BrandForm} />
            <Route path="/brands" component={Brands} />
            <Route path="/about" component={About} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/profile" component={Profile} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        </Container>
      </>
    );
  }
}
