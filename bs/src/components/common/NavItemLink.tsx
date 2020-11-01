import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  to: string
}

const NavItemLink: React.FC<Props> = ({ to, ...props }) => {
  return <NavLink className="nav-item nav-link" to={to} {...props}>{props.children}</NavLink>
}

export default NavItemLink;
