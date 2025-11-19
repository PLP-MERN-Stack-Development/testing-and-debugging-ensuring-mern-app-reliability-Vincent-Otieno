import React from 'react';
import './Input.css';

/**
 * Reusable Input component
 * @param {Object} props - Component props
 */
const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  const inputId = `input-${name}`;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`input ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${inputId}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
