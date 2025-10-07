import api from './api';

export interface Comment {
  id: string;
  content: string;
  task_id?: string;
  project_id?: string;
  user_id: string;
  parent_comment_id?: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    size: number;
    mime_type: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CreateCommentData {
  content: string;
  parent_comment_id?: string;
  attachments?: File[];
}

export interface UpdateCommentData {
  content: string;
}

export const commentsService = {
  // Get Comments by Task
  getCommentsByTask: async (taskId: string, params: any = {}): Promise<CommentResponse> => {
    const response = await api.get(`/comments/task/${taskId}`, { params });
    return response.data;
  },

  // Get Comments by Project
  getCommentsByProject: async (projectId: string, params: any = {}): Promise<CommentResponse> => {
    const response = await api.get(`/comments/project/${projectId}`, { params });
    return response.data;
  },

  // Get All Comments (with filters)
  getComments: async (params: any = {}): Promise<CommentResponse> => {
    const response = await api.get('/comments', { params });
    return response.data;
  },

  // Create Comment for Task
  createTaskComment: async (taskId: string, commentData: CreateCommentData): Promise<{ success: boolean; data: Comment }> => {
    const formData = new FormData();
    formData.append('content', commentData.content);
    
    if (commentData.parent_comment_id) {
      formData.append('parent_comment_id', commentData.parent_comment_id);
    }
    
    if (commentData.attachments) {
      commentData.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }

    const response = await api.post(`/comments/task/${taskId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Create Comment for Project
  createProjectComment: async (projectId: string, commentData: CreateCommentData): Promise<{ success: boolean; data: Comment }> => {
    const formData = new FormData();
    formData.append('content', commentData.content);
    
    if (commentData.parent_comment_id) {
      formData.append('parent_comment_id', commentData.parent_comment_id);
    }
    
    if (commentData.attachments) {
      commentData.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }

    const response = await api.post(`/comments/project/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update Comment
  updateComment: async (id: string, commentData: UpdateCommentData): Promise<{ success: boolean; data: Comment }> => {
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
  },

  // Delete Comment
  deleteComment: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  // Get Comment Replies
  getCommentReplies: async (commentId: string, params: any = {}): Promise<CommentResponse> => {
    const response = await api.get(`/comments/${commentId}/replies`, { params });
    return response.data;
  }
};
