import { useState, useEffect, useCallback } from 'react';
import { notificationsService, Notification } from '../services/notifications';

export const useNotifications = (params: any = {}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationsService.getNotifications(params);
      setNotifications(response.data.notifications);
      setApiAvailable(true);
    } catch (err: any) {
      // Jika API tidak tersedia (404), timeout, atau connection error, set apiAvailable ke false
      if (err.response?.status === 404 || err.code === 'ECONNABORTED' || err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setApiAvailable(false);
        setNotifications([]);
        // Tidak set error untuk kasus ini karena API belum tersedia
      } else {
        setError(err.message || 'Gagal memuat notifikasi');
      }
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    // Skip jika API tidak tersedia
    if (apiAvailable === false) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await notificationsService.getUnreadCount();
      
      // Check if response and data exist
      if (response && response.data) {
        // Handle different response formats from backend
        const data = response.data as any; // Type assertion for flexible response format
        const count = data.count || data.unread_count || 0;
        if (typeof count === 'number') {
          setUnreadCount(count);
          setApiAvailable(true);
        } else {
          console.warn('Invalid notification count format:', response.data);
          setUnreadCount(0);
          setApiAvailable(false);
        }
      } else {
        console.warn('Invalid notification response format:', response);
        setUnreadCount(0);
        setApiAvailable(false);
      }
    } catch (err: any) {
      // Jika API tidak tersedia (404), timeout, atau connection error, set apiAvailable ke false
      if (err.response?.status === 404 || err.code === 'ECONNABORTED' || err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setApiAvailable(false);
        setUnreadCount(0);
        // Tidak log error untuk kasus ini karena API belum tersedia
      } else {
        // Hanya log error untuk kasus lain
        console.error('Failed to fetch unread count:', err);
        setUnreadCount(0);
      }
    }
  }, [apiAvailable]);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Poll unread count setiap 30 detik hanya jika API tersedia
    const interval = setInterval(() => {
      if (apiAvailable !== false) {
        fetchUnreadCount();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount, apiAvailable]);

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (err: any) {
      throw err;
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      await fetchNotifications();
      setUnreadCount(0);
    } catch (err: any) {
      throw err;
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      await notificationsService.deleteNotification(id);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (err: any) {
      throw err;
    }
  };

  // Show notification (for compatibility with existing code)
  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    // This is a placeholder - you can integrate with your notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
    // You can add toast notification here if you have a toast library
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    apiAvailable,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    showNotification,
    refetch: fetchNotifications,
  };
};
