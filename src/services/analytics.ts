import api from './api';

export interface DashboardAnalytics {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  team_members: number;
  recent_activities: Array<{
    id: string;
    type: string;
    description: string;
    user_name: string;
    created_at: string;
  }>;
  project_completion_rate: number;
  task_completion_rate: number;
  productivity_trends: Array<{
    date: string;
    tasks_completed: number;
    hours_logged: number;
  }>;
}

export interface ProjectAnalytics {
  project_id: string;
  project_name: string;
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  todo_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  average_task_duration: number;
  team_performance: Array<{
    user_id: string;
    user_name: string;
    tasks_assigned: number;
    tasks_completed: number;
    completion_rate: number;
  }>;
  task_priority_distribution: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  timeline_data: Array<{
    date: string;
    tasks_created: number;
    tasks_completed: number;
  }>;
}

export interface TaskAnalytics {
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  todo_tasks: number;
  overdue_tasks: number;
  average_completion_time: number;
  task_velocity: Array<{
    period: string;
    tasks_completed: number;
  }>;
  priority_distribution: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  status_distribution: {
    todo: number;
    in_progress: number;
    done: number;
    blocked: number;
  };
  top_performers: Array<{
    user_id: string;
    user_name: string;
    tasks_completed: number;
    average_completion_time: number;
  }>;
}

export interface TeamPerformance {
  team_id: string;
  team_name: string;
  total_members: number;
  active_members: number;
  total_projects: number;
  completed_projects: number;
  total_tasks: number;
  completed_tasks: number;
  productivity_score: number;
  member_performance: Array<{
    user_id: string;
    user_name: string;
    tasks_assigned: number;
    tasks_completed: number;
    completion_rate: number;
    average_time: number;
  }>;
  project_contribution: Array<{
    project_id: string;
    project_name: string;
    tasks_count: number;
    completion_rate: number;
  }>;
}

export type AnalyticsPeriod = 'week' | 'month' | 'quarter' | 'year';

export const analyticsService = {
  // Get Dashboard Analytics
  getDashboardAnalytics: async (period: AnalyticsPeriod = 'month'): Promise<{ success: boolean; data: DashboardAnalytics }> => {
    const response = await api.get('/analytics/dashboard', { 
      params: { period } 
    });
    return response.data;
  },

  // Get Project Analytics
  getProjectAnalytics: async (projectId?: string, period: AnalyticsPeriod = 'month'): Promise<{ success: boolean; data: ProjectAnalytics[] }> => {
    const params: any = { period };
    if (projectId) params.project_id = projectId;
    
    const response = await api.get('/analytics/projects', { params });
    return response.data;
  },

  // Get Task Analytics
  getTaskAnalytics: async (projectId?: string, period: AnalyticsPeriod = 'month'): Promise<{ success: boolean; data: TaskAnalytics }> => {
    const params: any = { period };
    if (projectId) params.project_id = projectId;
    
    const response = await api.get('/analytics/tasks', { params });
    return response.data;
  },

  // Get Team Performance Analytics
  getTeamPerformance: async (teamId?: string, period: AnalyticsPeriod = 'month'): Promise<{ success: boolean; data: TeamPerformance[] }> => {
    const params: any = { period };
    if (teamId) params.team_id = teamId;
    
    const response = await api.get('/analytics/teams', { params });
    return response.data;
  },

  // Get User Performance Analytics
  getUserPerformance: async (userId?: string, period: AnalyticsPeriod = 'month'): Promise<{ success: boolean; data: any }> => {
    const params: any = { period };
    if (userId) params.user_id = userId;
    
    const response = await api.get('/analytics/users', { params });
    return response.data;
  },

  // Get Productivity Trends
  getProductivityTrends: async (period: AnalyticsPeriod = 'month', days?: number): Promise<{ success: boolean; data: any }> => {
    const params: any = { period };
    if (days) params.days = days;
    
    const response = await api.get('/analytics/productivity-trends', { params });
    return response.data;
  },

  // Get Custom Date Range Analytics
  getCustomRangeAnalytics: async (startDate: string, endDate: string, type: 'dashboard' | 'projects' | 'tasks' | 'teams'): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/analytics/${type}`, { 
      params: { 
        start_date: startDate, 
        end_date: endDate,
        custom_range: true 
      } 
    });
    return response.data;
  }
};
