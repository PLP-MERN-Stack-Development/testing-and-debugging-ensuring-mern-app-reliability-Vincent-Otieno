import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../../hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with initial value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initialValue')
    );

    expect(result.current[0]).toBe('initialValue');
  });

  it('should initialize with value from localStorage if it exists', () => {
    localStorage.setItem('testKey', JSON.stringify('storedValue'));

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initialValue')
    );

    expect(result.current[0]).toBe('storedValue');
  });

  it('should update localStorage when value is set', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initialValue')
    );

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('should handle complex objects', () => {
    const initialObject = { name: 'John', age: 30 };
    const { result } = renderHook(() =>
      useLocalStorage('userKey', initialObject)
    );

    expect(result.current[0]).toEqual(initialObject);

    const updatedObject = { name: 'Jane', age: 25 };
    act(() => {
      result.current[1](updatedObject);
    });

    expect(result.current[0]).toEqual(updatedObject);
    expect(JSON.parse(localStorage.getItem('userKey'))).toEqual(updatedObject);
  });

  it('should handle array values', () => {
    const initialArray = [1, 2, 3];
    const { result } = renderHook(() =>
      useLocalStorage('arrayKey', initialArray)
    );

    expect(result.current[0]).toEqual(initialArray);

    const updatedArray = [4, 5, 6];
    act(() => {
      result.current[1](updatedArray);
    });

    expect(result.current[0]).toEqual(updatedArray);
  });

  it('should support functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(6);
  });

  it('should remove value from localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initialValue')
    );

    act(() => {
      result.current[1]('storedValue');
    });

    expect(localStorage.getItem('testKey')).toBeTruthy();

    act(() => {
      result.current[2](); // removeValue
    });

    expect(result.current[0]).toBe('initialValue');
    expect(localStorage.getItem('testKey')).toBeNull();
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('testKey', 'invalid-json{');

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'fallbackValue')
    );

    expect(result.current[0]).toBe('fallbackValue');
  });

  it('should handle boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('boolKey', false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(JSON.parse(localStorage.getItem('boolKey'))).toBe(true);
  });

  it('should handle null values', () => {
    const { result } = renderHook(() => useLocalStorage('nullKey', null));

    expect(result.current[0]).toBeNull();

    act(() => {
      result.current[1]('notNull');
    });

    expect(result.current[0]).toBe('notNull');
  });
});
