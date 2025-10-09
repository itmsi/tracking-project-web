import { useState, useEffect } from 'react';
import { taskViewService } from '../services/taskViewService';

interface TaskMember {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  role: string;
  permissions: {
    can_edit: boolean;
    can_comment: boolean;
    can_upload: boolean;
  };
  joined_at: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
}

export const useTaskMembers = (taskId: string | null) => {
  const [members, setMembers] = useState<TaskMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await taskViewService.getTaskMembers(taskId);
      console.log('📋 loadMembers API response:', response);
      
      // Handle API response structure
      const responseData = response.data;
      let membersList: TaskMember[] = [];
      
      if (Array.isArray(responseData)) {
        membersList = responseData;
      } else if (responseData && typeof responseData === 'object') {
        // API might wrap data: { data: { members: [...] } } or { members: [...] }
        membersList = responseData.data?.members || responseData.members || [];
      }
      
      setMembers(Array.isArray(membersList) ? membersList : []);
    } catch (err: any) {
      console.error('❌ loadMembers error:', err);
      setError(err.response?.data?.message || 'Failed to load members');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (userId: string, role: string = 'member', permissions: { can_edit?: boolean; can_comment?: boolean; can_upload?: boolean } = {}) => {
    if (!taskId) throw new Error('Task ID is required');

    try {
      const response = await taskViewService.addTaskMember(taskId, {
        user_id: userId,
        role,
        can_edit: permissions.can_edit !== false,
        can_comment: permissions.can_comment !== false,
        can_upload: permissions.can_upload !== false
      });
      
      setMembers(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const updateMember = async (memberId: string, updates: { role?: string; can_edit?: boolean; can_comment?: boolean; can_upload?: boolean }) => {
    if (!taskId) throw new Error('Task ID is required');

    try {
      const response = await taskViewService.updateTaskMember(taskId, memberId, updates);
      
      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, ...response.data } : member
      ));
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update member');
    }
  };

  const removeMember = async (memberId: string) => {
    if (!taskId) throw new Error('Task ID is required');

    try {
      await taskViewService.removeTaskMember(taskId, memberId);
      setMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const searchUsers = async (query: string): Promise<User[]> => {
    if (!taskId) throw new Error('Task ID is required');

    try {
      const response = await taskViewService.searchUsersForTask(taskId, query);
      console.log('🔍 searchUsers API response:', response);
      
      // Handle different response structures
      // API might return: { data: { users: [...] } } or { data: [...] }
      const responseData = response.data;
      
      if (Array.isArray(responseData)) {
        return responseData;
      } else if (responseData && typeof responseData === 'object') {
        // Check common properties
        const users = responseData.data || responseData.users || [];
        return Array.isArray(users) ? users : [];
      }
      
      return [];
    } catch (err: any) {
      console.error('❌ searchUsers error:', err);
      throw new Error(err.response?.data?.message || 'Failed to search users');
    }
  };

  useEffect(() => {
    if (taskId) {
      loadMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  return {
    members,
    loading,
    error,
    addMember,
    updateMember,
    removeMember,
    searchUsers,
    refresh: loadMembers
  };
};
