import api from './api';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user' | 'manager';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface UserStats {
  total_projects: number;
  active_projects: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  teams_joined: number;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface UserSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
  sort_by?: 'name' | 'email' | 'created_at' | 'last_login';
  sort_order?: 'asc' | 'desc';
}

export const usersService = {
  // Get Users List
  getUsers: async (params: UserSearchParams = {}): Promise<UserResponse> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get User Detail
  getUser: async (id: string): Promise<{ success: boolean; data: User }> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Search Users (untuk assign task, add member, dll)
  searchUsers: async (searchTerm: string, params: any = {}): Promise<UserResponse> => {
    const response = await api.get('/users', { 
      params: { ...params, search: searchTerm } 
    });
    return response.data;
  },

  // Get Users by Role
  getUsersByRole: async (role: string, params: any = {}): Promise<UserResponse> => {
    const response = await api.get('/users', { 
      params: { ...params, role } 
    });
    return response.data;
  },

  // Get Active Users
  getActiveUsers: async (params: any = {}): Promise<UserResponse> => {
    const response = await api.get('/users', { 
      params: { ...params, is_active: true } 
    });
    return response.data;
  },

  // Update User (admin only)
  updateUser: async (id: string, userData: Partial<User>): Promise<{ success: boolean; data: User }> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Deactivate User (admin only)
  deactivateUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data;
  },

  // Activate User (admin only)
  activateUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/users/${id}/activate`);
    return response.data;
  },

  // Get User Statistics
  getUserStats: async (id: string): Promise<{ success: boolean; data: UserStats }> => {
    const response = await api.get(`/users/${id}/stats`);
    return response.data;
  },

  // Get User Projects
  getUserProjects: async (id: string, params: any = {}): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get(`/users/${id}/projects`, { params });
    return response.data;
  },

  // Get User Tasks
  getUserTasks: async (id: string, params: any = {}): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get(`/users/${id}/tasks`, { params });
    return response.data;
  },

  // Get User Teams
  getUserTeams: async (id: string, params: any = {}): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get(`/users/${id}/teams`, { params });
    return response.data;
  }
};
