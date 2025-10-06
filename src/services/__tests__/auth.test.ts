import { authService } from '../auth';
import api from '../api';

// Mock the API module
jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call API with correct data and return response', async () => {
      const mockResponse = {
        data: {
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
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const credentials = { email: 'test@example.com', password: 'password123' };
      const result = await authService.login(credentials);

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error', async () => {
      const mockError = new Error('Login failed');
      mockedApi.post.mockRejectedValue(mockError);

      const credentials = { email: 'test@example.com', password: 'wrongpassword' };

      await expect(authService.login(credentials)).rejects.toThrow('Login failed');
    });
  });

  describe('register', () => {
    it('should call API with correct data and return response', async () => {
      const mockResponse = {
        data: {
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
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const userData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
      };

      const result = await authService.register(userData);

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getProfile', () => {
    it('should call API and return user profile', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'user',
            created_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await authService.getProfile();

      expect(mockedApi.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateProfile', () => {
    it('should call API with correct data and return response', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: '1',
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Smith',
            role: 'user',
            created_at: '2024-01-01T00:00:00Z',
          },
        },
      };

      mockedApi.put.mockResolvedValue(mockResponse);

      const profileData = {
        first_name: 'John',
        last_name: 'Smith',
      };

      const result = await authService.updateProfile(profileData);

      expect(mockedApi.put).toHaveBeenCalledWith('/auth/profile', profileData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('changePassword', () => {
    it('should call API with correct data and return response', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Password changed successfully',
        },
      };

      mockedApi.put.mockResolvedValue(mockResponse);

      const passwordData = {
        current_password: 'oldpassword',
        new_password: 'newpassword',
        confirm_password: 'newpassword',
      };

      const result = await authService.changePassword(passwordData);

      expect(mockedApi.put).toHaveBeenCalledWith('/auth/change-password', passwordData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('should call API and return success message', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Logout berhasil',
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await authService.logout();

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/logout');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('refreshToken', () => {
    it('should call API with correct data and return response', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Token refreshed successfully',
          data: {
            access_token: 'new-token123',
            refresh_token: 'new-refresh123',
            user: {
              id: '1',
              email: 'test@example.com',
              first_name: 'John',
              last_name: 'Doe',
              role: 'user',
              created_at: '2024-01-01T00:00:00Z',
            },
          },
        },
      };

      mockedApi.post.mockResolvedValue(mockResponse);

      const result = await authService.refreshToken('refresh-token');

      expect(mockedApi.post).toHaveBeenCalledWith('/auth/refresh-token', {
        refresh_token: 'refresh-token',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });
});