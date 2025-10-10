import api from './api';

// API wrapper response structure
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface TaskViewResponse {
  task: {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    created_at: string;
    updated_at: string;
  };
  details: {
    id: string;
    description: string;
    requirements: string;
    acceptance_criteria: string;
    created_at: string;
    updated_at: string;
  } | null;
  members: Array<{
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
  }>;
  attachments: Array<{
    id: string;
    original_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    description: string;
    is_public: boolean;
    user_id: string;
    uploader_first_name: string;
    uploader_last_name: string;
    created_at: string;
  }>;
  chat: {
    messages: Array<{
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
    }>;
  };
  user_permissions: {
    hasAccess?: boolean;
    userId?: string;
    isOwner: boolean;
    role: string;
    permissions?: {
      can_edit: boolean;
      can_comment: boolean;
      can_upload: boolean;
    };
  };
}

export interface TaskDetailsData {
  description: string;
  requirements: string;
  acceptance_criteria: string;
}

export interface ChatMessageData {
  message: string;
  attachments?: number[];
}

export interface ChatMessageUpdate {
  message: string;
}

export interface AttachmentUploadData {
  file_type: string;
  description: string;
  is_public: boolean;
}

export interface TaskMemberData {
  user_id: string;
  role: string;
  can_edit: boolean;
  can_comment: boolean;
  can_upload: boolean;
}

export interface TaskMemberUpdate {
  role?: string;
  can_edit?: boolean;
  can_comment?: boolean;
  can_upload?: boolean;
}

export const taskViewService = {
  // Complete Task View - One-stop endpoint untuk semua data task
  getTaskView: (taskId: string): Promise<{ data: ApiResponse<TaskViewResponse> }> =>
    api.get(`/api/tasks/${taskId}/view`, {
      // Tambahkan cache busting untuk mencegah browser cache (ETag)
      params: { _t: Date.now() }
    }),

  // Task Details Management
  getTaskDetails: (taskId: string): Promise<{ data: any }> =>
    api.get(`/api/tasks/${taskId}/details`),
  
  createTaskDetails: (taskId: string, data: TaskDetailsData): Promise<{ data: any }> =>
    api.post(`/api/tasks/${taskId}/details`, data),
  
  updateTaskDetails: (taskId: string, data: TaskDetailsData): Promise<{ data: any }> =>
    api.put(`/api/tasks/${taskId}/details`, data),

  // Task Chat System - Real-time chat antar member task
  getTaskChat: (taskId: string, params: { limit?: number; offset?: number } = {}): Promise<{ data: any }> =>
    api.get(`/api/tasks/${taskId}/chat`, { params }),
  
  createChatMessage: (taskId: string, data: ChatMessageData): Promise<{ data: any }> =>
    api.post(`/api/tasks/${taskId}/chat`, data),
  
  updateChatMessage: (taskId: string, messageId: string, data: ChatMessageUpdate): Promise<{ data: any }> =>
    api.put(`/api/tasks/${taskId}/chat/${messageId}`, data),
  
  deleteChatMessage: (taskId: string, messageId: string): Promise<void> =>
    api.delete(`/api/tasks/${taskId}/chat/${messageId}`),

  // File Attachments - Upload dan manage file attachments
  getTaskAttachments: (taskId: string, params: { file_type?: string; is_public?: boolean } = {}): Promise<{ data: any }> =>
    api.get(`/api/tasks/${taskId}/attachments`, { params }),
  
  uploadAttachment: (taskId: string, file: File, data: AttachmentUploadData): Promise<{ data: any }> => {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof AttachmentUploadData] as string);
    });
    return api.post(`/api/tasks/${taskId}/attachments/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  deleteAttachment: (taskId: string, attachmentId: string): Promise<void> =>
    api.delete(`/api/tasks/${taskId}/attachments/${attachmentId}`),

  // Download Attachment - Get download URL or trigger download
  downloadAttachment: (taskId: string, attachmentId: string): Promise<void> => {
    // Buat URL download dan trigger download
    const downloadUrl = `/api/tasks/${taskId}/attachments/${attachmentId}/download`;
    
    // Buat hidden link untuk download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return Promise.resolve();
  },

  // Member Management - Add/remove members dengan role-based permissions
  getTaskMembers: (taskId: string, params: { role?: string } = {}): Promise<{ data: any }> =>
    api.get(`/api/tasks/${taskId}/members`, { params }),
  
  addTaskMember: (taskId: string, data: TaskMemberData): Promise<{ data: any }> =>
    api.post(`/api/tasks/${taskId}/members`, data),
  
  updateTaskMember: (taskId: string, memberId: string, data: TaskMemberUpdate): Promise<{ data: any }> =>
    api.put(`/api/tasks/${taskId}/members/${memberId}`, data),
  
  removeTaskMember: (taskId: string, memberId: string): Promise<void> =>
    api.delete(`/api/tasks/${taskId}/members/${memberId}`),
  
  searchUsersForTask: (taskId: string, query: string, limit: number = 10): Promise<{ data: any }> =>
    api.get(`/api/tasks/${taskId}/members/search`, { 
      params: { q: query, limit } 
    })
};
