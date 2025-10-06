import api from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  color: string;
  team_name?: string;
  creator_first_name: string;
  creator_last_name: string;
  created_at: string;
  members?: number;
}

export interface ProjectStats {
  tasks: Array<{ status: string; count: string }>;
  members: number;
  overdue_tasks: number;
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: {
    projects: Project[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export const projectsService = {
  // Get Projects List
  getProjects: async (params: any = {}): Promise<ProjectResponse> => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  // Create Project
  createProject: async (projectData: Partial<Project>): Promise<{ success: boolean; data: Project }> => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  // Get Project Detail
  getProject: async (id: string): Promise<{ success: boolean; data: Project }> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Update Project
  updateProject: async (id: string, projectData: Partial<Project>): Promise<{ success: boolean; data: Project }> => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete Project
  deleteProject: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Get Project Members
  getProjectMembers: async (id: string): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get(`/projects/${id}/members`);
    return response.data;
  },

  // Add Project Member
  addProjectMember: async (id: string, memberData: { user_id: string; role: string }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post(`/projects/${id}/members`, memberData);
    return response.data;
  },

  // Update Project Member
  updateProjectMember: async (id: string, userId: string, role: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.put(`/projects/${id}/members/${userId}`, { role });
    return response.data;
  },

  // Remove Project Member
  removeProjectMember: async (id: string, userId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/projects/${id}/members/${userId}`);
    return response.data;
  },

  // Get Project Statistics
  getProjectStats: async (id: string): Promise<{ success: boolean; data: ProjectStats }> => {
    const response = await api.get(`/projects/${id}/stats`);
    return response.data;
  }
};
