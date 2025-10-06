import axios from 'axios';
import api from '../api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('API Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('should create axios instance with correct configuration', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:9552/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should add Authorization header when token exists', () => {
    localStorageMock.setItem('access_token', 'test-token');
    
    // Create a new request config
    const config = {
      headers: {},
    };
    
    // Simulate the request interceptor
    const requestInterceptor = (api as any).interceptors.request.handlers[0].fulfilled;
    const result = requestInterceptor(config);
    
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('should not add Authorization header when token does not exist', () => {
    const config = {
      headers: {},
    };
    
    // Simulate the request interceptor
    const requestInterceptor = (api as any).interceptors.request.handlers[0].fulfilled;
    const result = requestInterceptor(config);
    
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should handle request interceptor error', () => {
    const error = new Error('Request error');
    
    // Simulate the request interceptor error handler
    const requestErrorInterceptor = (api as any).interceptors.request.handlers[0].rejected;
    const result = requestErrorInterceptor(error);
    
    expect(result).rejects.toThrow('Request error');
  });

  it('should handle successful response', () => {
    const response = {
      data: { success: true },
      status: 200,
    };
    
    // Simulate the response interceptor
    const responseInterceptor = (api as any).interceptors.response.handlers[0].fulfilled;
    const result = responseInterceptor(response);
    
    expect(result).toEqual(response);
  });

  it('should handle 401 error and redirect to login', () => {
    const error = {
      response: {
        status: 401,
      },
    };
    
    // Simulate the response interceptor error handler
    const responseErrorInterceptor = (api as any).interceptors.response.handlers[0].rejected;
    responseErrorInterceptor(error);
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
    expect(mockLocation.href).toBe('/login');
  });

  it('should handle non-401 error', () => {
    const error = {
      response: {
        status: 500,
      },
    };
    
    // Simulate the response interceptor error handler
    const responseErrorInterceptor = (api as any).interceptors.response.handlers[0].rejected;
    const result = responseErrorInterceptor(error);
    
    expect(result).rejects.toEqual(error);
    expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    expect(mockLocation.href).toBe('');
  });

  it('should handle error without response', () => {
    const error = new Error('Network error');
    
    // Simulate the response interceptor error handler
    const responseErrorInterceptor = (api as any).interceptors.response.handlers[0].rejected;
    const result = responseErrorInterceptor(error);
    
    expect(result).rejects.toThrow('Network error');
  });
});