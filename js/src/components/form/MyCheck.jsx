import React from 'react';

export default function MyCheck({ name, label, value, error, onChange }) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        id={name}
        name={name}
        checked={value}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={name}>{label}</label>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
