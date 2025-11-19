import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../../components/Input';

describe('Input Component', () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with label', () => {
    render(
      <Input
        label="Username"
        name="username"
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('should render without label', () => {
    render(
      <Input
        name="username"
        placeholder="Enter username"
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('should show required indicator when required prop is true', () => {
    render(
      <Input
        label="Email"
        name="email"
        value=""
        onChange={mockOnChange}
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display error message when error prop is provided', () => {
    render(
      <Input
        label="Email"
        name="email"
        value=""
        onChange={mockOnChange}
        error="Invalid email address"
      />
    );

    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should apply error styling when error prop is provided', () => {
    render(
      <Input
        label="Email"
        name="email"
        value=""
        onChange={mockOnChange}
        error="Invalid email"
      />
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('input-error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should call onChange when input value changes', () => {
    render(
      <Input
        label="Username"
        name="username"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Username');
    fireEvent.change(input, { target: { value: 'testuser' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should call onBlur when input loses focus', () => {
    render(
      <Input
        label="Username"
        name="username"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByLabelText('Username');
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  it('should render with different input types', () => {
    const { rerender } = render(
      <Input
        type="text"
        label="Text Input"
        name="text"
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Text Input')).toHaveAttribute('type', 'text');

    rerender(
      <Input
        type="password"
        label="Password Input"
        name="password"
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Password Input')).toHaveAttribute('type', 'password');

    rerender(
      <Input
        type="email"
        label="Email Input"
        name="email"
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Email Input')).toHaveAttribute('type', 'email');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <Input
        label="Username"
        name="username"
        value=""
        onChange={mockOnChange}
        disabled
      />
    );

    const input = screen.getByLabelText('Username');
    expect(input).toBeDisabled();
  });

  it('should display placeholder text', () => {
    render(
      <Input
        label="Username"
        name="username"
        placeholder="Enter your username"
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    const { container } = render(
      <Input
        label="Username"
        name="username"
        value=""
        onChange={mockOnChange}
        className="custom-wrapper"
      />
    );

    expect(container.querySelector('.custom-wrapper')).toBeInTheDocument();
  });

  it('should pass additional props to input element', () => {
    render(
      <Input
        label="Username"
        name="username"
        value=""
        onChange={mockOnChange}
        data-testid="custom-input"
        maxLength="50"
      />
    );

    const input = screen.getByTestId('custom-input');
    expect(input).toHaveAttribute('maxLength', '50');
  });
});
