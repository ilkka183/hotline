import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './NavBar';

import Movies from './views/Movies';
import Customers from './views/Customers';
import Rentals from './views/Rentals';
import NotFound from './views/NotFound';

import LoginForm from './forms/LoginForm';
import MovieForm from './forms/MovieForm';

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container">
        <Switch>
          <Route path="/login" component={LoginForm} />
          <Route path="/movies/:id" component={MovieForm} />
          <Route path="/movies" component={Movies} />
          <Route path="/customers" component={Customers} />
          <Route path="/rentals" component={Rentals} />
          <Route path="/not-found" component={NotFound} />
          <Redirect from="/" exact to="/movies" />
          <Redirect to="/not-found" />
        </Switch>
      </main>
    </>
  );
}
