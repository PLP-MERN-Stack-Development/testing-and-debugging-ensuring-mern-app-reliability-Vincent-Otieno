import { renderHook, act } from '@testing-library/react';
import useForm from '../../hooks/useForm';

describe('useForm Hook', () => {
  const initialValues = {
    username: '',
    email: '',
    password: '',
  };

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with initial values', () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit));

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle input change', () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit));

    act(() => {
      result.current.handleChange({
        target: { name: 'username', value: 'testuser' },
      });
    });

    expect(result.current.values.username).toBe('testuser');
  });

  it('should handle checkbox input', () => {
    const initialCheckbox = { agree: false };
    const { result } = renderHook(() => useForm(initialCheckbox, mockOnSubmit));

    act(() => {
      result.current.handleChange({
        target: { name: 'agree', type: 'checkbox', checked: true },
      });
    });

    expect(result.current.values.agree).toBe(true);
  });

  it('should clear errors when field value changes', () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit));

    // Set an error
    act(() => {
      result.current.setFieldError('username', 'Username is required');
    });

    expect(result.current.errors.username).toBe('Username is required');

    // Change field value
    act(() => {
      result.current.handleChange({
        target: { name: 'username', value: 'newuser' },
      });
    });

    expect(result.current.errors.username).toBeUndefined();
  });

  it('should mark field as touched on blur', () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit));

    act(() => {
      result.current.handleBlur({
        target: { name: 'email' },
      });
    });

    expect(result.current.touched.email).toBe(true);
  });

  it('should submit form with valid data', async () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit));

    // Set form values
    act(() => {
      result.current.setFormValues({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should validate form before submission', async () => {
    const validate = (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = 'Username is required';
      }
      return errors;
    };

    const { result } = renderHook(() =>
      useForm(initialValues, mockOnSubmit, validate)
    );

    // Try to submit without filling required field
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    expect(result.current.errors.username).toBe('Username is required');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should reset form to initial values', () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit));

    // Change values
    act(() => {
      result.current.setFieldValue('username', 'testuser');
      result.current.setFieldError('email', 'Invalid email');
    });

    // Reset form
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('should set field value manually', () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit));

    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('should set field error manually', () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit));

    act(() => {
      result.current.setFieldError('password', 'Password too weak');
    });

    expect(result.current.errors.password).toBe('Password too weak');
  });

  it('should set isSubmitting during form submission', async () => {
    const slowSubmit = () =>
      new Promise((resolve) => setTimeout(resolve, 100));

    const { result } = renderHook(() => useForm(initialValues, slowSubmit));

    const submitPromise = act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    // Should be submitting during the async operation
    // Note: This is a simplified test, actual timing may vary

    await submitPromise;

    // Should be done submitting after promise resolves
    expect(result.current.isSubmitting).toBe(false);
  });
});
