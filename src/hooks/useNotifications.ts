import { useState, useEffect, useCallback } from 'react';
import { notificationsService, Notification } from '../services/notifications';

export const useNotifications = (params: any = {}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationsService.getNotifications(params);
      setNotifications(response.data.notifications);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat notifikasi');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationsService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (err: any) {
      console.error('Failed to fetch unread count:', err);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Poll unread count setiap 30 detik
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount]);

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

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
  };
};
