import api from './api';

export interface UploadedFile {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  size: number;
  mime_type: string;
  type: 'avatar' | 'task_attachment' | 'project_file' | 'team_file' | 'comment_attachment';
  user_id: string;
  related_id?: string; // ID dari task, project, comment, dll
  related_type?: 'task' | 'project' | 'team' | 'comment';
  metadata?: {
    width?: number;
    height?: number;
    duration?: number; // untuk video/audio
    thumbnail_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: UploadedFile;
}

export interface BatchUploadResponse {
  success: boolean;
  message: string;
  data: {
    files: UploadedFile[];
    failed_uploads?: Array<{
      filename: string;
      error: string;
    }>;
  };
}

export type UploadType = 'avatar' | 'task_attachment' | 'project_file' | 'team_file' | 'comment_attachment';

export interface UploadOptions {
  type: UploadType;
  related_id?: string;
  related_type?: string;
  onProgress?: (progress: UploadProgress) => void;
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // MIME types
}

export const uploadService = {
  // Upload Single File
  uploadFile: async (
    file: File, 
    options: UploadOptions
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', options.type);
    
    if (options.related_id) {
      formData.append('related_id', options.related_id);
    }
    
    if (options.related_type) {
      formData.append('related_type', options.related_type);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (options.onProgress) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
          };
          options.onProgress(progress);
        }
      },
    };

    const response = await api.post('/api/upload', formData, config);
    return response.data;
  },

  // Upload Multiple Files
  uploadMultipleFiles: async (
    files: File[], 
    options: UploadOptions
  ): Promise<BatchUploadResponse> => {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    
    formData.append('type', options.type);
    
    if (options.related_id) {
      formData.append('related_id', options.related_id);
    }
    
    if (options.related_type) {
      formData.append('related_type', options.related_type);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (options.onProgress) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
          };
          options.onProgress(progress);
        }
      },
    };

    const response = await api.post('/api/upload/batch', formData, config);
    return response.data;
  },

  // Upload Avatar
  uploadAvatar: async (file: File, onProgress?: (progress: UploadProgress) => void): Promise<UploadResponse> => {
    return uploadService.uploadFile(file, {
      type: 'avatar',
      onProgress,
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
  },

  // Upload Task Attachment
  uploadTaskAttachment: async (
    file: File, 
    taskId: string, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> => {
    return uploadService.uploadFile(file, {
      type: 'task_attachment',
      related_id: taskId,
      related_type: 'task',
      onProgress,
      maxSize: 50 * 1024 * 1024 // 50MB
    });
  },

  // Upload Project File
  uploadProjectFile: async (
    file: File, 
    projectId: string, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> => {
    return uploadService.uploadFile(file, {
      type: 'project_file',
      related_id: projectId,
      related_type: 'project',
      onProgress,
      maxSize: 100 * 1024 * 1024 // 100MB
    });
  },

  // Upload Team File
  uploadTeamFile: async (
    file: File, 
    teamId: string, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> => {
    return uploadService.uploadFile(file, {
      type: 'team_file',
      related_id: teamId,
      related_type: 'team',
      onProgress,
      maxSize: 100 * 1024 * 1024 // 100MB
    });
  },

  // Upload Comment Attachment
  uploadCommentAttachment: async (
    file: File, 
    commentId: string, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> => {
    return uploadService.uploadFile(file, {
      type: 'comment_attachment',
      related_id: commentId,
      related_type: 'comment',
      onProgress,
      maxSize: 25 * 1024 * 1024 // 25MB
    });
  },

  // Delete File
  deleteFile: async (fileId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/upload/${fileId}`);
    return response.data;
  },

  // Get File Info
  getFileInfo: async (fileId: string): Promise<{ success: boolean; data: UploadedFile }> => {
    const response = await api.get(`/upload/${fileId}`);
    return response.data;
  },

  // Get User Files
  getUserFiles: async (params: any = {}): Promise<{ success: boolean; data: { files: UploadedFile[]; pagination: any } }> => {
    const response = await api.get('/api/upload/user/files', { params });
    return response.data;
  },

  // Get Files by Type
  getFilesByType: async (type: UploadType, params: any = {}): Promise<{ success: boolean; data: { files: UploadedFile[]; pagination: any } }> => {
    const response = await api.get('/api/upload/files', { 
      params: { ...params, type } 
    });
    return response.data;
  },

  // Get Files by Related ID
  getFilesByRelatedId: async (relatedId: string, relatedType: string, params: any = {}): Promise<{ success: boolean; data: { files: UploadedFile[]; pagination: any } }> => {
    const response = await api.get('/api/upload/files', { 
      params: { ...params, related_id: relatedId, related_type: relatedType } 
    });
    return response.data;
  },

  // Update File Metadata
  updateFileMetadata: async (fileId: string, metadata: any): Promise<{ success: boolean; data: UploadedFile }> => {
    const response = await api.patch(`/upload/${fileId}`, { metadata });
    return response.data;
  },

  // Get Upload Limits
  getUploadLimits: async (): Promise<{ success: boolean; data: { max_file_size: number; allowed_types: string[]; max_files_per_upload: number } }> => {
    const response = await api.get('/api/upload/limits');
    return response.data;
  }
};
