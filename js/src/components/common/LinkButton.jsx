import React from 'react';
import { Link } from 'react-router-dom';

export default function LinkButton({ className, to, ...props }) {
  return (
    <Link className={'btn btn-primary ' + className} to={to} {...props}>{props.children}</Link>
  );
}


