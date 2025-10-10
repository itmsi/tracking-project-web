import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { WEBSOCKET_EVENTS } from '../utils/websocketEvents';
import { toast } from 'react-toastify';
import { taskViewService } from '../services/taskViewService';

export const useWebSocketChat = (taskId: string, initialMessages: any[] = []) => {
  const { socket, isConnected } = useWebSocket();
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // typingTimeoutRef is used in TaskChatWebSocket component

  // Update messages when initialMessages prop changes
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      console.log('💬 Setting initial messages from prop:', initialMessages);
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Load initial chat history (fallback jika initialMessages kosong)
  const loadChatHistory = useCallback(async () => {
    if (!taskId) return;

    try {
      setIsLoading(true);
      const response = await taskViewService.getTaskChat(taskId, { limit: 100 });
      console.log('📜 Chat history loaded:', response);
      
      // Handle API response structure
      const chatData = response.data?.data || response.data;
      const messagesList = chatData?.messages || chatData?.chat?.messages || [];
      
      console.log('💬 Setting messages from API:', messagesList);
      setMessages(Array.isArray(messagesList) ? messagesList : []);
    } catch (err: any) {
      console.error('❌ Failed to load chat history:', err);
      setError(err.response?.data?.message || 'Failed to load chat history');
      setMessages([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  // Join task room
  const joinTask = useCallback(() => {
    if (socket && taskId) {
      socket.emit(WEBSOCKET_EVENTS.JOIN_TASK, taskId);
    }
  }, [socket, taskId]);

  // Leave task room
  const leaveTask = useCallback(() => {
    if (socket && taskId) {
      socket.emit(WEBSOCKET_EVENTS.LEAVE_TASK, taskId);
    }
  }, [socket, taskId]);

  // Send message - Save ke database dulu, baru emit WebSocket
  const sendMessage = useCallback(async (message: string, attachments: any[] = [], replyTo?: string) => {
    if (!taskId || !message.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Save ke database via HTTP API (prioritas utama)
      console.log('💾 Saving message to database...');
      const response = await taskViewService.createChatMessage(taskId, {
        message: message.trim(),
        attachments: attachments.map((a: any) => a.id || a).filter(Boolean)
      });
      
      console.log('✅ Message saved to database:', response.data);
      
      // 2. Tambahkan message ke local state (optimistic update)
      setMessages(prev => [...prev, response.data]);
      
      // 3. Emit WebSocket event untuk real-time update ke user lain (optional)
      // Backend akan handle broadcast setelah save
      if (socket && socket.connected) {
        console.log('📡 Emitting WebSocket event for real-time update...');
        socket.emit(WEBSOCKET_EVENTS.SEND_MESSAGE, {
          taskId,
          message: message.trim(),
          attachments,
          replyTo,
          messageId: response.data.id // Include message ID yang sudah tersimpan
        });
      } else {
        console.warn('⚠️ WebSocket not connected, message saved to DB but no real-time update');
      }
      
      // Notifikasi toast dihilangkan - tidak perlu notifikasi untuk setiap chat
      // toast.success('Message sent successfully');
    } catch (err: any) {
      console.error('❌ Failed to send message:', err);
      setError('Failed to send message');
      toast.error(err.response?.data?.message || 'Failed to send message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [socket, taskId]);

  // Edit message - Update database dulu, baru emit WebSocket
  const editMessage = useCallback(async (messageId: string, newMessage: string) => {
    if (!taskId || !messageId || !newMessage.trim()) {
      return;
    }

    try {
      // 1. Update database via HTTP API
      console.log('💾 Updating message in database...');
      const response = await taskViewService.updateChatMessage(taskId, messageId, {
        message: newMessage.trim()
      });
      
      console.log('✅ Message updated in database:', response.data);
      
      // 2. Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? response.data : msg
        )
      );
      
      // 3. Emit WebSocket event untuk real-time update ke user lain (optional)
      if (socket && socket.connected) {
        console.log('📡 Emitting WebSocket event for real-time update...');
        socket.emit(WEBSOCKET_EVENTS.EDIT_MESSAGE, {
          taskId,
          messageId,
          newMessage: newMessage.trim()
        });
      }
      
      // Notifikasi toast dihilangkan - tidak perlu notifikasi untuk edit
      // toast.success('Message updated successfully');
    } catch (err: any) {
      console.error('❌ Failed to update message:', err);
      toast.error(err.response?.data?.message || 'Failed to update message');
      throw err;
    }
  }, [socket, taskId]);

  // Delete message - Delete from database dulu, baru emit WebSocket
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!taskId || !messageId) {
      return;
    }

    try {
      // 1. Delete from database via HTTP API
      console.log('💾 Deleting message from database...');
      await taskViewService.deleteChatMessage(taskId, messageId);
      
      console.log('✅ Message deleted from database');
      
      // 2. Remove from local state
      setMessages(prev => 
        prev.filter(msg => msg.id !== messageId)
      );
      
      // 3. Emit WebSocket event untuk real-time update ke user lain (optional)
      if (socket && socket.connected) {
        console.log('📡 Emitting WebSocket event for real-time update...');
        socket.emit(WEBSOCKET_EVENTS.DELETE_MESSAGE, {
          taskId,
          messageId
        });
      }
      
      // Notifikasi toast dihilangkan - tidak perlu notifikasi untuk delete
      // toast.success('Message deleted successfully');
    } catch (err: any) {
      console.error('❌ Failed to delete message:', err);
      toast.error(err.response?.data?.message || 'Failed to delete message');
      throw err;
    }
  }, [socket, taskId]);

  // Start typing
  const startTyping = useCallback(() => {
    if (socket && taskId && !isTyping) {
      setIsTyping(true);
      socket.emit(WEBSOCKET_EVENTS.TYPING_START, { taskId });
    }
  }, [socket, taskId, isTyping]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (socket && taskId && isTyping) {
      setIsTyping(false);
      socket.emit(WEBSOCKET_EVENTS.TYPING_STOP, { taskId });
    }
  }, [socket, taskId, isTyping]);

  // Setup event listeners
  useEffect(() => {
    if (!socket) return;

    // Message events - Hanya untuk real-time update dari user lain
    // Tidak perlu update local state karena sudah di-update saat send
    socket.on(WEBSOCKET_EVENTS.NEW_MESSAGE, (data: any) => {
      console.log('📨 Received new_message event:', data);
      // Cek apakah message sudah ada di local state (dari own send)
      setMessages(prev => {
        const exists = prev.find(msg => msg.id === data.message?.id);
        if (exists) {
          console.log('⚠️ Message already exists in local state, skipping');
          return prev;
        }
        console.log('✅ Adding new message from WebSocket');
        return [...prev, data.message];
      });
    });

    socket.on(WEBSOCKET_EVENTS.MESSAGE_EDITED, (data: any) => {
      console.log('📝 Received message_edited event:', data);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.message.id ? data.message : msg
        )
      );
    });

    socket.on(WEBSOCKET_EVENTS.MESSAGE_DELETED, (data: any) => {
      console.log('🗑️ Received message_deleted event:', data);
      setMessages(prev => 
        prev.filter(msg => msg.id !== data.messageId)
      );
    });

    // User events
    socket.on(WEBSOCKET_EVENTS.USER_JOINED, (data: any) => {
      console.log('👤 User joined:', data.userName);
      setOnlineUsers(prev => [...prev, data]);
      // Toast dihilangkan - terlalu mengganggu
      // toast.success(`${data.userName} joined the chat`);
    });

    socket.on(WEBSOCKET_EVENTS.USER_LEFT, (data: any) => {
      console.log('👤 User left:', data.userName);
      setOnlineUsers(prev => 
        prev.filter(user => user.userId !== data.userId)
      );
      // Toast dihilangkan - terlalu mengganggu
      // toast.info(`${data.userName} left the chat`);
    });

    // Typing events
    socket.on(WEBSOCKET_EVENTS.USER_TYPING, (data: any) => {
      setTypingUsers(prev => {
        const exists = prev.find(user => user.userId === data.userId);
        if (!exists) {
          return [...prev, data];
        }
        return prev;
      });
    });

    socket.on(WEBSOCKET_EVENTS.USER_STOPPED_TYPING, (data: any) => {
      setTypingUsers(prev => 
        prev.filter(user => user.userId !== data.userId)
      );
    });

    // Task events
    socket.on(WEBSOCKET_EVENTS.TASK_NOTIFICATION, (notification: any) => {
      console.log('📢 Task notification:', notification.message);
      // Toast dihilangkan - gunakan notification bell di header
      // toast.info(notification.message);
    });

    socket.on(WEBSOCKET_EVENTS.TASK_UPDATED, (update: any) => {
      console.log('📝 Task updated:', update);
      // Toast dihilangkan - terlalu mengganggu
      // toast.info('Task has been updated');
    });

    socket.on(WEBSOCKET_EVENTS.MEMBER_CHANGED, (change: any) => {
      console.log('👥 Task members changed:', change);
      // Toast dihilangkan - terlalu mengganggu
      // toast.info('Task members have changed');
    });

    // Error handling
    socket.on(WEBSOCKET_EVENTS.ERROR, (error: any) => {
      setError(error.message);
      toast.error(error.message);
    });

    return () => {
      socket.off(WEBSOCKET_EVENTS.NEW_MESSAGE);
      socket.off(WEBSOCKET_EVENTS.MESSAGE_EDITED);
      socket.off(WEBSOCKET_EVENTS.MESSAGE_DELETED);
      socket.off(WEBSOCKET_EVENTS.USER_JOINED);
      socket.off(WEBSOCKET_EVENTS.USER_LEFT);
      socket.off(WEBSOCKET_EVENTS.USER_TYPING);
      socket.off(WEBSOCKET_EVENTS.USER_STOPPED_TYPING);
      socket.off(WEBSOCKET_EVENTS.TASK_NOTIFICATION);
      socket.off(WEBSOCKET_EVENTS.TASK_UPDATED);
      socket.off(WEBSOCKET_EVENTS.MEMBER_CHANGED);
      socket.off(WEBSOCKET_EVENTS.ERROR);
    };
  }, [socket]);

  // Load chat history on mount - SELALU load dari database untuk memastikan riwayat lengkap
  useEffect(() => {
    if (taskId) {
      console.log('📜 Loading chat history from database...');
      loadChatHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);
  
  // Jika ada initialMessages, merge dengan messages dari database (untuk backward compatibility)
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0 && messages.length === 0) {
      console.log('📦 Using initial messages as fallback');
      setMessages(initialMessages);
    }
  }, [initialMessages, messages.length]);

  // Auto join/leave task
  useEffect(() => {
    if (isConnected && taskId) {
      joinTask();
    }

    return () => {
      if (taskId) {
        leaveTask();
      }
    };
  }, [isConnected, taskId, joinTask, leaveTask]);

  // Auto stop typing on unmount
  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, [stopTyping]);

  return {
    messages,
    isConnected,
    isLoading,
    error,
    typingUsers,
    onlineUsers,
    sendMessage,
    editMessage,
    deleteMessage,
    startTyping,
    stopTyping,
    joinTask,
    leaveTask,
    loadChatHistory
  };
};
