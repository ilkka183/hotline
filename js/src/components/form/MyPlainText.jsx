import React from 'react';

export default function MyPlainText({ name, label, value, error, onChange }) {
  return (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label" htmlFor={name}>{label}</label>
      <div className="col-sm-10">
        <input
          className="form-control-plaintext"
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
        />
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
}
