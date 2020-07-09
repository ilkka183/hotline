import React from 'react';

export default function MyTextArea({ name, label, rows, value, error, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <textarea
        className="form-control"
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
