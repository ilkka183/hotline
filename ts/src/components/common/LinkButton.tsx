import React from 'react';
import { Link } from 'react-router-dom';

export default function LinkButton({ className, variant, size, to, ...props }) {
  let classes = 'btn btn-' + (variant ? variant : 'primary');

  if (size)
    classes += ' btn-' + size;

  if (className)
    classes += ' ' + className;

  return (
    <Link className={classes} to={to} {...props}>{props.children}</Link>
  );
}


