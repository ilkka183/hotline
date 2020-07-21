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
import MakeForm from './views/Makes/MakeForm';

import ModelsTable from './views/Models/ModelsTable';
import ModelForm from './views/Models/ModelForm';

import UserGroupsTable from './views/UserGroups/UserGroupsTable';
import UserGroupForm from './views/UserGroups/UserGroupForm';

import UsersTable from './views/Users/UsersTable';
import UserForm from './views/Users/UserForm';
import { POWER_ROLE } from './views/Users/UsersTable';

import ProblemsTable from './views/Problems/ProblemsTable';
import Problem from './views/Problems/Problem';
import ProblemForm from './views/Problems/ProblemForm';
import ProblemAttachmentForm from './views/Problems/ProblemAttachmentForm';
import ProblemReplyForm from './views/Problems/ProblemReplyForm';
import NewProblem from './views/Problems/New/NewProblem';

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
            <ProtectedRoute path="/problems/new" component={NewProblem} />
            <ProtectedRoute path="/problems/:id" component={ProblemForm} />
            <ProtectedRoute path="/problems" component={ProblemsTable} />
            <ProtectedRoute path="/problemattachments/:id" component={ProblemAttachmentForm} />
            <ProtectedRoute path="/problemreplies/:id" component={ProblemReplyForm} />
            <ProtectedRoute path="/usergroups/:id" component={UserGroupForm} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/usergroups" component={UserGroupsTable} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/users/:id" component={UserForm} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/users" component={UsersTable} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/makes/:id" component={MakeForm} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/makes" component={MakesTable} requiredRole={POWER_ROLE} />
            <ProtectedRoute path="/models/:id" component={ModelForm} requiredRole={POWER_ROLE} />
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
