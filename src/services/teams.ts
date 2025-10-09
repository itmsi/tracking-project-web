import api from './api';

export interface Team {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  role: 'admin' | 'member';
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
  joined_at: string;
}

export interface TeamResponse {
  success: boolean;
  message: string;
  data: {
    teams: Team[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface TeamStats {
  members: number;
  projects: number;
  active_tasks: number;
  completed_tasks: number;
}

export const teamsService = {
  // Get Teams List
  getTeams: async (params: any = {}): Promise<TeamResponse> => {
      const response = await api.get('/api/teams', { params });
    return response.data;
  },

  // Create Team
  createTeam: async (teamData: Partial<Team>): Promise<{ success: boolean; data: Team }> => {
      const response = await api.post('/api/teams', teamData);
    return response.data;
  },

  // Get Team Detail
  getTeam: async (id: string): Promise<{ success: boolean; data: Team }> => {
    const response = await api.get(`/api/teams/${id}`);
    return response.data;
  },

  // Update Team
  updateTeam: async (id: string, teamData: Partial<Team>): Promise<{ success: boolean; data: Team }> => {
    const response = await api.put(`/api/teams/${id}`, teamData);
    return response.data;
  },

  // Delete Team
  deleteTeam: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/teams/${id}`);
    return response.data;
  },

  // Get Team Members
  getTeamMembers: async (id: string): Promise<{ success: boolean; data: TeamMember[] }> => {
    const response = await api.get(`/api/teams/${id}/members`);
    return response.data;
  },

  // Add Team Member
  addTeamMember: async (id: string, memberData: { user_id: string; role: string }): Promise<{ success: boolean; data: TeamMember }> => {
    const response = await api.post(`/api/teams/${id}/members`, memberData);
    return response.data;
  },

  // Update Team Member Role
  updateTeamMember: async (id: string, userId: string, role: string): Promise<{ success: boolean; data: TeamMember }> => {
    const response = await api.put(`/api/teams/${id}/members/${userId}`, { role });
    return response.data;
  },

  // Remove Team Member
  removeTeamMember: async (id: string, userId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/teams/${id}/members/${userId}`);
    return response.data;
  },

  // Get Team Statistics
  getTeamStats: async (id: string): Promise<{ success: boolean; data: TeamStats }> => {
    const response = await api.get(`/api/teams/${id}/stats`);
    return response.data;
  }
};
