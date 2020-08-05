import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import auth, { User, UserRole } from '../services/authService';

interface Props extends RouteProps {
  requiredRole?: UserRole
}

const ProtectedRoute: React.FC< Props> = ({ path, component: Component, render, requiredRole, ...rest }) => {
  const user: User | null = auth.getCurrentUser();

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

        return Component ? <Component {...props} /> : (render ? render(props) : null);
      }}
    />
  );
}

export default ProtectedRoute;
