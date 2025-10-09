import { useState, useEffect, useCallback } from 'react';
import { taskViewService } from '../services/taskViewService';

interface ChatMessage {
  id: string;
  message: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  attachments: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

export const useTaskChat = (taskId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadMessages = useCallback(async (reset = false) => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);
      const newOffset = reset ? 0 : offset;
      const response = await taskViewService.getTaskChat(taskId, {
        limit: 50,
        offset: newOffset
      });

      const newMessages = response.data.messages;
      
      if (reset) {
        setMessages(newMessages);
        setOffset(50);
      } else {
        setMessages(prev => [...prev, ...newMessages]);
        setOffset(prev => prev + 50);
      }

      setHasMore(newMessages.length === 50);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [taskId, offset]);

  const sendMessage = async (message: string, attachments: number[] = []) => {
    if (!taskId) throw new Error('Task ID is required');

    try {
      const response = await taskViewService.createChatMessage(taskId, {
        message,
        attachments
      });
      
      setMessages(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to send message');
    }
  };

  const updateMessage = async (messageId: string, newMessage: string) => {
    if (!taskId) throw new Error('Task ID is required');

    try {
      const response = await taskViewService.updateChatMessage(taskId, messageId, {
        message: newMessage
      });
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? response.data : msg
      ));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update message');
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!taskId) throw new Error('Task ID is required');

    try {
      await taskViewService.deleteChatMessage(taskId, messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete message');
    }
  };

  useEffect(() => {
    loadMessages(true);
  }, [taskId]);

  return {
    messages,
    loading,
    error,
    hasMore,
    sendMessage,
    updateMessage,
    deleteMessage,
    loadMore: () => loadMessages(false),
    refresh: () => loadMessages(true)
  };
};
