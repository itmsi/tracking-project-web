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

  // Send message
  const sendMessage = useCallback(async (message: string, attachments: any[] = [], replyTo?: string) => {
    if (!socket || !taskId || !message.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      socket.emit(WEBSOCKET_EVENTS.SEND_MESSAGE, {
        taskId,
        message: message.trim(),
        attachments,
        replyTo
      });
    } catch (err) {
      setError('Failed to send message');
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [socket, taskId]);

  // Edit message
  const editMessage = useCallback((messageId: string, newMessage: string) => {
    if (!socket || !taskId || !messageId || !newMessage.trim()) {
      return;
    }

    socket.emit(WEBSOCKET_EVENTS.EDIT_MESSAGE, {
      taskId,
      messageId,
      newMessage: newMessage.trim()
    });
  }, [socket, taskId]);

  // Delete message
  const deleteMessage = useCallback((messageId: string) => {
    if (!socket || !taskId || !messageId) {
      return;
    }

    socket.emit(WEBSOCKET_EVENTS.DELETE_MESSAGE, {
      taskId,
      messageId
    });
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

    // Message events
    socket.on(WEBSOCKET_EVENTS.NEW_MESSAGE, (data: any) => {
      setMessages(prev => [...prev, data.message]);
    });

    socket.on(WEBSOCKET_EVENTS.MESSAGE_EDITED, (data: any) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.message.id ? data.message : msg
        )
      );
    });

    socket.on(WEBSOCKET_EVENTS.MESSAGE_DELETED, (data: any) => {
      setMessages(prev => 
        prev.filter(msg => msg.id !== data.messageId)
      );
    });

    // User events
    socket.on(WEBSOCKET_EVENTS.USER_JOINED, (data: any) => {
      setOnlineUsers(prev => [...prev, data]);
      toast.success(`${data.userName} joined the chat`);
    });

    socket.on(WEBSOCKET_EVENTS.USER_LEFT, (data: any) => {
      setOnlineUsers(prev => 
        prev.filter(user => user.userId !== data.userId)
      );
      toast.info(`${data.userName} left the chat`);
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
      toast.info(notification.message);
    });

    socket.on(WEBSOCKET_EVENTS.TASK_UPDATED, (update: any) => {
      toast.info('Task has been updated');
    });

    socket.on(WEBSOCKET_EVENTS.MEMBER_CHANGED, (change: any) => {
      toast.info('Task members have changed');
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

  // Load chat history on mount (only if initialMessages is empty)
  useEffect(() => {
    if (initialMessages.length === 0) {
      console.log('📜 Loading chat history from API (no initial messages)');
      loadChatHistory();
    } else {
      console.log('✅ Using initial messages from TaskView, skipping API call');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

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
