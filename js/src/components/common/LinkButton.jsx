import React from 'react';
import { Link } from 'react-router-dom';

export default function LinkButton({ to, ...props }) {
  return (
    <Link className="btn btn-primary" to={to} {...props}>{props.children}</Link>
  );
}


