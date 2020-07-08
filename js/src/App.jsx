import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NavBar from './NavBar';
import ProtectedRoute from './components/common/ProtectedRoute';
import MovieForm from './forms/MovieForm';
import Movies from './views/Movies';
import UserGroupForm from './forms/UserGroupForm';
import UserGroups from './views/UserGroups';
import UserForm from './views/UserForm';
import Users from './views/Users';
import NotFound from './views/NotFound';
import RegisterForm from './forms/RegisterForm';
import LoginForm from './forms/LoginForm';
import Logout from './views/Logout';
import Profile from './views/Profile';
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
        <NavBar user={user} />
        <Switch>
          <Route path="/register" component={RegisterForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/logout" component={Logout} />
          <Route path="/profile" component={Profile} />
          <ProtectedRoute path="/movies/:id" component={MovieForm} />
          <Route path="/movies" component={Movies} />
          <ProtectedRoute path="/usergroups/:id" component={UserGroupForm} />
          <Route path="/usergroups" component={UserGroups} />
          <ProtectedRoute path="/users/:id" component={UserForm} />
          <Route path="/users" component={Users} />
          <Route path="/not-found" component={NotFound} />
          <Redirect from="/" exact to="/movies" />
          <Redirect to="/not-found" />
        </Switch>
      </>
    );
  }
}
