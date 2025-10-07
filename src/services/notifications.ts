import api from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task_assigned' | 'task_completed' | 'task_due' | 'project_updated' | 'team_invite' | 'comment_added' | 'system';
  is_read: boolean;
  user_id: string;
  related_id?: string; // ID dari task, project, atau resource terkait
  related_type?: 'task' | 'project' | 'team' | 'comment';
  metadata?: {
    task_title?: string;
    project_name?: string;
    team_name?: string;
    assigner_name?: string;
    due_date?: string;
  };
  created_at: string;
  read_at?: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_type: {
    task_assigned: number;
    task_completed: number;
    task_due: number;
    project_updated: number;
    team_invite: number;
    comment_added: number;
    system: number;
  };
}

export const notificationsService = {
  // Get Notifications
  getNotifications: async (params: any = {}): Promise<NotificationResponse> => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Get Unread Notifications
  getUnreadNotifications: async (params: any = {}): Promise<NotificationResponse> => {
    const response = await api.get('/notifications', { 
      params: { ...params, unread_only: true } 
    });
    return response.data;
  },

  // Get Unread Count
  getUnreadCount: async (): Promise<{ success: boolean; data: { count: number } }> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Mark Notification as Read
  markAsRead: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark All Notifications as Read
  markAllAsRead: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  // Delete Notification
  deleteNotification: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Get Notification Statistics
  getNotificationStats: async (): Promise<{ success: boolean; data: NotificationStats }> => {
    const response = await api.get('/notifications/stats');
    return response.data;
  },

  // Create Notification (untuk testing atau admin)
  createNotification: async (notificationData: {
    title: string;
    message: string;
    type: Notification['type'];
    user_id: string;
    related_id?: string;
    related_type?: string;
    metadata?: any;
  }): Promise<{ success: boolean; data: Notification }> => {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  }
};
