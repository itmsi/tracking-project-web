import api from './api';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'task_assigned' | 'task_completed' | 'task_due' | 'project_updated' | 'team_invite' | 'comment_added' | 'chat_message' | 'reply' | 'mention' | 'system';
  is_read: boolean;
  user_id: string;
  sender_id?: string; // ID pengirim notifikasi
  related_id?: string; // ID dari task, project, atau resource terkait
  related_type?: 'task' | 'project' | 'team' | 'comment';
  data?: {
    task_id?: string;
    task_title?: string;
    message_id?: string;
    reply_to_message_id?: string;
    sender_name?: string;
    sender_email?: string;
    full_message?: string;
    project_name?: string;
    team_name?: string;
    assigner_name?: string;
    due_date?: string;
  };
  metadata?: {
    task_title?: string;
    project_name?: string;
    team_name?: string;
    assigner_name?: string;
    due_date?: string;
  };
  created_at: string;
  read_at?: string;
  sender?: {
    id?: string;
    name?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}

// Alias untuk backward compatibility
export type Notification = AppNotification;

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    notifications: AppNotification[];
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
    try {
      const response = await api.get('/api/notifications', { params });
      return response.data;
    } catch (error: any) {
      // Jika endpoint belum tersedia (404) atau network error, return data kosong
      if (error.response?.status === 404 || error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        // Tidak log error untuk 404 karena API belum tersedia
        if (error.response?.status !== 404) {
          console.warn('Notifications API tidak tersedia');
        }
        return {
          success: true,
          message: 'Notifications API belum tersedia',
          data: {
            notifications: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              pages: 0
            }
          }
        };
      }
      throw error;
    }
  },

  // Get Unread Notifications
  getUnreadNotifications: async (params: any = {}): Promise<NotificationResponse> => {
    try {
      const response = await api.get('/api/notifications', { 
        params: { ...params, unread_only: true } 
      });
      return response.data;
    } catch (error: any) {
      // Jika endpoint belum tersedia (404) atau network error, return data kosong
      if (error.response?.status === 404 || error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        // Tidak log error untuk 404 karena API belum tersedia
        if (error.response?.status !== 404) {
          console.warn('Notifications API tidak tersedia');
        }
        return {
          success: true,
          message: 'Notifications API belum tersedia',
          data: {
            notifications: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              pages: 0
            }
          }
        };
      }
      throw error;
    }
  },

  // Get Unread Count
  getUnreadCount: async (): Promise<{ success: boolean; data: { count?: number; unread_count?: number } }> => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      return response.data;
    } catch (error: any) {
      // Jika endpoint belum tersedia (404) atau network error, return count 0
      if (error.response?.status === 404 || error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        // Tidak log error untuk 404 karena API belum tersedia
        if (error.response?.status !== 404) {
          console.warn('Notifications unread count API tidak tersedia');
        }
        return {
          success: true,
          data: { count: 0 }
        };
      }
      throw error;
    }
  },

  // Mark Notification as Read
  markAsRead: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.patch(`/api/notifications/${id}/read`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Notifications API belum tersedia di backend');
        return { success: false, message: 'Notifications API belum tersedia' };
      }
      throw error;
    }
  },

  // Mark All Notifications as Read
  markAllAsRead: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.patch('/api/notifications/read-all');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Notifications API belum tersedia di backend');
        return { success: false, message: 'Notifications API belum tersedia' };
      }
      throw error;
    }
  },

  // Delete Notification
  deleteNotification: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/api/notifications/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Notifications API belum tersedia di backend');
        return { success: false, message: 'Notifications API belum tersedia' };
      }
      throw error;
    }
  },

  // Get Notification Statistics
  getNotificationStats: async (): Promise<{ success: boolean; data: NotificationStats }> => {
    try {
      const response = await api.get('/api/notifications/stats');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Notifications stats API belum tersedia di backend');
        return {
          success: true,
          data: {
            total: 0,
            unread: 0,
            by_type: {
              task_assigned: 0,
              task_completed: 0,
              task_due: 0,
              project_updated: 0,
              team_invite: 0,
              comment_added: 0,
              system: 0
            }
          }
        };
      }
      throw error;
    }
  },

  // Create Notification (untuk testing atau admin)
  createNotification: async (notificationData: {
    title: string;
    message: string;
    type: AppNotification['type'];
    user_id: string;
    related_id?: string;
    related_type?: string;
    metadata?: any;
  }): Promise<{ success: boolean; data: AppNotification }> => {
    try {
      const response = await api.post('/api/notifications', notificationData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Notifications API belum tersedia di backend');
        throw new Error('Notifications API belum tersedia di backend');
      }
      throw error;
    }
  }
};
