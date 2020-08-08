import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  className: string,
  variant: string,
  size: string,
  to: string
}

const LinkButton: React.FC<Props> = ({ className, variant, size, to, ...props }) => {
  let classes: string = 'btn btn-' + (variant ? variant : 'primary');

  if (size)
    classes += ' btn-' + size;

  if (className)
    classes += ' ' + className;

  return (
    <Link className={classes} to={to} {...props}>{props.children}</Link>
  );
}

export default LinkButton;
