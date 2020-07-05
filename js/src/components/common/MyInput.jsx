import React from 'react';

export default function MyInput({ name, label, type, autoFocus, value, error, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        className="form-control"
        id={name}
        name={name}
        type={type}
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
