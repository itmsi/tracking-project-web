import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login, logout, clearError, getProfile } from '../authSlice';
import { authService } from '../../services/auth';

// Mock the auth service
jest.mock('../../services/auth');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe('Auth Slice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth;
      expect(state).toEqual({
        user: null,
        token: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    });
  });

  describe('login async thunk', () => {
    it('should handle successful login', async () => {
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

      const credentials = { email: 'test@example.com', password: 'password123' };
      await store.dispatch(login(credentials));

      const state = store.getState().auth;
      expect(state.user).toEqual(mockResponse.data.user);
      expect(state.token).toBe(mockResponse.data.access_token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle login failure', async () => {
      const mockError = 'Invalid credentials';
      mockedAuthService.login.mockRejectedValue(mockError);

      const credentials = { email: 'test@example.com', password: 'wrongpassword' };
      await store.dispatch(login(credentials));

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(mockError);
    });
  });

  describe('logout action', () => {
    it('should clear user data and tokens', () => {
      // First set some initial state
      store.dispatch({
        type: 'auth/login/fulfilled',
        payload: {
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
      });

      // Then logout
      store.dispatch(logout());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('clearError action', () => {
    it('should clear error state', () => {
      // First set an error
      store.dispatch({
        type: 'auth/login/rejected',
        payload: 'Some error',
      });

      // Then clear error
      store.dispatch(clearError());

      const state = store.getState().auth;
      expect(state.error).toBeNull();
    });
  });

  describe('getProfile async thunk', () => {
    it('should handle successful profile fetch', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: '1',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'user',
          created_at: '2024-01-01T00:00:00Z',
        },
      };

      mockedAuthService.getProfile.mockResolvedValue(mockResponse);

      await store.dispatch(getProfile());

      const state = store.getState().auth;
      expect(state.user).toEqual(mockResponse.data);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle profile fetch failure', async () => {
      const mockError = 'Unauthorized';
      mockedAuthService.getProfile.mockRejectedValue(mockError);

      await store.dispatch(getProfile());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
