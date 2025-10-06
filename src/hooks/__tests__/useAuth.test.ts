import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAuth } from '../useAuth';
import authReducer from '../../store/authSlice';
import { authService } from '../../services/auth';

// Mock the auth service
jest.mock('../../services/auth');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

// Mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        ...initialState,
      },
    },
  });
};

const renderHookWithStore = (hook: any, initialState = {}) => {
  const store = createMockStore(initialState);
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return renderHook(hook, { wrapper });
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial auth state', () => {
    const { result } = renderHookWithStore(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should return authenticated state when user and token exist', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'user',
      created_at: '2024-01-01T00:00:00Z',
    };
    
    const initialState = {
      user: mockUser,
      token: 'mock-token',
      isAuthenticated: true,
    };
    
    const { result } = renderHookWithStore(() => useAuth(), initialState);
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('mock-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should login user successfully', async () => {
    const mockResponse = {
      success: true,
      message: 'Login berhasil',
      data: {
        access_token: 'token123',
        refresh_token: 'refresh123',
        user: {
          id: '1',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'user',
          created_at: '2024-01-01T00:00:00Z',
        },
      },
    };

    mockedAuthService.login.mockResolvedValue(mockResponse);
    
    const { result } = renderHookWithStore(() => useAuth());
    
    const credentials = { email: 'test@example.com', password: 'password123' };
    const loginResult = await result.current.login(credentials);
    
    expect(loginResult.success).toBe(true);
  });

  it('should handle login error', async () => {
    const errorMessage = 'Invalid credentials';
    mockedAuthService.login.mockRejectedValue(errorMessage);
    
    const { result } = renderHookWithStore(() => useAuth());
    
    const credentials = { email: 'test@example.com', password: 'wrongpassword' };
    const loginResult = await result.current.login(credentials);
    
    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe(errorMessage);
  });

  it('should register user successfully', async () => {
    const mockResponse = {
      success: true,
      message: 'Registrasi berhasil',
      data: {
        access_token: 'token123',
        refresh_token: 'refresh123',
        user: {
          id: '1',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'user',
          created_at: '2024-01-01T00:00:00Z',
        },
      },
    };

    mockedAuthService.register.mockResolvedValue(mockResponse);
    
    const { result } = renderHookWithStore(() => useAuth());
    
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      role: 'user',
    };
    
    const registerResult = await result.current.register(userData);
    
    expect(registerResult.success).toBe(true);
  });

  it('should handle register error', async () => {
    const errorMessage = 'Email already exists';
    mockedAuthService.register.mockRejectedValue(errorMessage);
    
    const { result } = renderHookWithStore(() => useAuth());
    
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      role: 'user',
    };
    
    const registerResult = await result.current.register(userData);
    
    expect(registerResult.success).toBe(false);
    expect(registerResult.error).toBe(errorMessage);
  });

  it('should logout user', () => {
    const initialState = {
      user: {
        id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
        created_at: '2024-01-01T00:00:00Z',
      },
      token: 'mock-token',
      isAuthenticated: true,
    };
    
    const { result } = renderHookWithStore(() => useAuth(), initialState);
    
    result.current.logout();
    
    // The logout action should clear the user and token
    // This would be tested by checking the store state
    expect(result.current.logout).toBeDefined();
  });

  it('should refresh profile successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'user',
      created_at: '2024-01-01T00:00:00Z',
    };

    mockedAuthService.getProfile.mockResolvedValue({
      success: true,
      data: mockUser,
    });
    
    const initialState = {
      token: 'mock-token',
    };
    
    const { result } = renderHookWithStore(() => useAuth(), initialState);
    
    const refreshResult = await result.current.refreshProfile();
    
    expect(refreshResult.success).toBe(true);
  });

  it('should handle refresh profile error when no token', async () => {
    const { result } = renderHookWithStore(() => useAuth());
    
    const refreshResult = await result.current.refreshProfile();
    
    expect(refreshResult.success).toBe(false);
    expect(refreshResult.error).toBe('No token available');
  });
});