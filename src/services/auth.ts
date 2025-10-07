import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
}

export const authService = {
  // Register
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    
    // Simpan token ke localStorage
    if (response.data.data?.access_token) {
      localStorage.setItem('access_token', response.data.data.access_token);
      if (response.data.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.data.refresh_token);
      }
    }
    
    return response.data;
  },

  // Get Profile
  getProfile: async (): Promise<{ success: boolean; data: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update Profile
  updateProfile: async (profileData: Partial<User>): Promise<{ success: boolean; data: User }> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change Password
  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    return { success: true, message: 'Logged out successfully' };
  },

  // Refresh Token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh-token', {
      refresh_token: refreshToken
    });
    return response.data;
  }
};
