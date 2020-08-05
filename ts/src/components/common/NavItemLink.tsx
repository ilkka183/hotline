import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavItemLink({ to, ...props }) {
  return <NavLink className="nav-item nav-link" to={to} {...props}>{props.children}</NavLink>
}
