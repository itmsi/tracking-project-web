import api from './api';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  project_id: string;
  assigned_to?: string;
  assignee_first_name?: string;
  assignee_last_name?: string;
  assignee_avatar_url?: string;
  due_date?: string;
  parent_task_id?: string;
  position: number;
  checklist?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  created_at: string;
  updated_at: string;
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: {
    tasks: Task[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export const tasksService = {
  // Get Tasks List
  getTasks: async (params: any = {}): Promise<TaskResponse> => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Create Task
  createTask: async (taskData: Partial<Task>): Promise<{ success: boolean; data: Task }> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Get Task Detail
  getTask: async (id: string): Promise<{ success: boolean; data: Task }> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Update Task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<{ success: boolean; data: Task }> => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete Task
  deleteTask: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Update Task Status
  updateTaskStatus: async (id: string, status: string, position?: number): Promise<{ success: boolean; data: Task }> => {
    const response = await api.patch(`/tasks/${id}/status`, { status, position });
    return response.data;
  },

  // Assign Task
  assignTask: async (id: string, assignedTo: string | null): Promise<{ success: boolean; data: Task }> => {
    const response = await api.patch(`/tasks/${id}/assign`, { assigned_to: assignedTo });
    return response.data;
  },

  // Update Task Position
  updateTaskPosition: async (id: string, position: number): Promise<{ success: boolean; data: Task }> => {
    const response = await api.patch(`/tasks/${id}/position`, { position });
    return response.data;
  },

  // Get Subtasks
  getSubtasks: async (id: string): Promise<{ success: boolean; data: Task[] }> => {
    const response = await api.get(`/tasks/${id}/subtasks`);
    return response.data;
  },

  // Create Subtask
  createSubtask: async (id: string, subtaskData: Partial<Task>): Promise<{ success: boolean; data: Task }> => {
    const response = await api.post(`/tasks/${id}/subtasks`, subtaskData);
    return response.data;
  },

  // Add Task Attachment
  addTaskAttachment: async (id: string, attachmentData: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post(`/tasks/${id}/attachments`, attachmentData);
    return response.data;
  },

  // Remove Task Attachment
  removeTaskAttachment: async (id: string, attachmentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/tasks/${id}/attachments/${attachmentId}`);
    return response.data;
  }
};
