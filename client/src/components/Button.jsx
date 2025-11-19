import React from 'react';
import './Button.css';

/**
 * Reusable Button component
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant: primary, secondary, danger
 * @param {string} props.size - Button size: sm, md, lg
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  children,
  ...rest
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const disabledClass = disabled ? 'btn-disabled' : '';

  const classNames = [baseClass, variantClass, sizeClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={classNames}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
