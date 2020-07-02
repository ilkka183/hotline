import React from 'react';

export default function Like({ liked, onClick }) {
  let classes = 'fa fa-heart';

  if (!liked)
    classes += '-o';

  return (
    <i
      className={classes}
      style={{ cursor: 'pointer' }}
      aria-hidden="true"
      onClick={onClick}>
    </i>
  );
}
