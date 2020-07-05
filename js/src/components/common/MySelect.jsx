import React from 'react';

export default function MySelect({ name, label, options, value, error, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        className="form-control"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map(option => (
          <option
            key={option.Id}
            value={option.Id}
          >
            {option.Name}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
