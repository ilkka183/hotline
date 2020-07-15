import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../services/authService';

export default function ProtectedRoute({ path, component: Component, render, requiredRole, ...rest }) {
  const user = auth.getCurrentUser();

  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        if (!user || (requiredRole && user.role > requiredRole))
          return <Redirect to={{
            pathname: '/not-found',
            state: { from: props.location }
          }} />

        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
}
