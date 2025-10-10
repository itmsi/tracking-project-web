import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationsService, AppNotification } from '../services/notifications';
import { useWebSocket } from '../contexts/WebSocketContext';

export const useNotifications = (params: any = {}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const { socket, isConnected } = useWebSocket();
  const hasSetupWebSocket = useRef(false);
  const paramsRef = useRef(params);
  
  // Update params ref when params change
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationsService.getNotifications(paramsRef.current);
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
  }, []);

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

  // Initial load
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll unread count setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      if (apiAvailable !== false) {
        fetchUnreadCount();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [apiAvailable, fetchUnreadCount]);

  // WebSocket listener untuk notifikasi real-time
  useEffect(() => {
    console.log('🔔 useNotifications: WebSocket state check:', {
      hasSocket: !!socket,
      isConnected,
      hasSetupWebSocket: hasSetupWebSocket.current,
      willSetup: !!(socket && isConnected && !hasSetupWebSocket.current)
    });

    if (!socket || !isConnected || hasSetupWebSocket.current) {
      return;
    }

    console.log('🔔 useNotifications: Setting up WebSocket notification listener...');
    console.log('🔔 useNotifications: Socket ID:', socket.id);
    console.log('🔔 useNotifications: Existing listeners for "notification":', socket.listeners('notification').length);
    hasSetupWebSocket.current = true;

    // Function untuk play notification sound
    const playNotificationSound = () => {
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => {
          // Ignore error jika browser block autoplay
          console.log('Could not play notification sound:', e.message);
        });
      } catch (err) {
        console.log('Notification sound error:', err);
      }
    };

    // Function untuk show browser notification
    const showBrowserNotification = (notification: AppNotification) => {
      if ('Notification' in window && window.Notification.permission === 'granted') {
        try {
          new window.Notification(notification.title, {
            body: notification.message,
            icon: '/logo192.png',
            badge: '/logo192.png',
            tag: notification.id,
          });
        } catch (err) {
          console.log('Browser notification error:', err);
        }
      } else if ('Notification' in window && window.Notification.permission === 'default') {
        // Request permission
        window.Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showBrowserNotification(notification);
          }
        });
      }
    };

    // Listen untuk notifikasi baru
    const handleNotification = (notification: AppNotification) => {
      console.log('🔔 useNotifications: New notification received via WebSocket!');
      console.log('📦 useNotifications: Notification data:', notification);
      console.log('📊 useNotifications: Notification type:', notification.type);
      console.log('📋 useNotifications: Notification title:', notification.title);
      console.log('💬 useNotifications: Notification message:', notification.message);
      
      // Tambahkan notifikasi baru ke list
      setNotifications(prev => {
        const newList = [notification, ...prev];
        console.log('📝 useNotifications: Updated notification list. Total:', newList.length);
        return newList;
      });
      
      // Increment unread count
      setUnreadCount(prev => {
        const newCount = prev + 1;
        console.log('📈 useNotifications: Unread count incremented:', prev, '→', newCount);
        return newCount;
      });
      
      // Play notification sound (optional)
      playNotificationSound();
      
      // Show browser notification jika diizinkan
      showBrowserNotification(notification);
      
      console.log('✅ useNotifications: Notification processing complete!');
    };

    console.log('🎧 useNotifications: Attaching "notification" event listener...');
    socket.on('notification', handleNotification);
    console.log('✅ useNotifications: Event listener attached successfully!');
    console.log('📊 useNotifications: Total listeners for "notification":', socket.listeners('notification').length);

    return () => {
      if (socket) {
        socket.off('notification', handleNotification);
        hasSetupWebSocket.current = false;
      }
    };
  }, [socket, isConnected]);

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
