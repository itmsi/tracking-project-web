import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, useSessionStorage, useTheme, useLanguage } from '../useLocalStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('initial-value');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('should return stored value from localStorage', () => {
    localStorageMock.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
  });

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));
    
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(1));
  });

  it('should handle JSON parse errors gracefully', () => {
    localStorageMock.setItem('test-key', 'invalid-json');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('initial-value');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should return initial value when sessionStorage is empty', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('initial-value');
    expect(sessionStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('should return stored value from sessionStorage', () => {
    sessionStorageMock.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial-value'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update sessionStorage when value changes', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial-value'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(result.current[0]).toBe('new-value');
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
  });
});

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should return light theme as default', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('light');
  });

  it('should toggle theme from light to dark', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', JSON.stringify('dark'));
  });

  it('should toggle theme from dark to light', () => {
    localStorageMock.setItem('theme', JSON.stringify('dark'));
    
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', JSON.stringify('light'));
  });

  it('should set theme directly', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(result.current.theme).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', JSON.stringify('dark'));
  });
});

describe('useLanguage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should return Indonesian as default language', () => {
    const { result } = renderHook(() => useLanguage());
    
    expect(result.current.language).toBe('id');
  });

  it('should change language to English', () => {
    const { result } = renderHook(() => useLanguage());
    
    act(() => {
      result.current.changeLanguage('en');
    });
    
    expect(result.current.language).toBe('en');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('language', JSON.stringify('en'));
  });

  it('should change language to Indonesian', () => {
    localStorageMock.setItem('language', JSON.stringify('en'));
    
    const { result } = renderHook(() => useLanguage());
    
    act(() => {
      result.current.changeLanguage('id');
    });
    
    expect(result.current.language).toBe('id');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('language', JSON.stringify('id'));
  });

  it('should set language directly', () => {
    const { result } = renderHook(() => useLanguage());
    
    act(() => {
      result.current.setLanguage('en');
    });
    
    expect(result.current.language).toBe('en');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('language', JSON.stringify('en'));
  });
});