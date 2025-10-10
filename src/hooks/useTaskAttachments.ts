import { useState, useEffect } from 'react';
import { taskViewService } from '../services/taskViewService';

interface Attachment {
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
}

export const useTaskAttachments = (taskId: string | null) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadAttachments = async (filters: { file_type?: string; is_public?: boolean } = {}) => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await taskViewService.getTaskAttachments(taskId, filters);
      setAttachments(response.data.attachments || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load attachments');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, metadata: { description?: string; isPublic?: boolean } = {}) => {
    if (!taskId) throw new Error('Task ID is required');

    try {
      setUploading(true);
      const response = await taskViewService.uploadAttachment(taskId, file, {
        file_type: getFileType(file.type),
        description: metadata.description || '',
        is_public: metadata.isPublic !== false
      });
      
      setAttachments(prev => [response.data, ...(prev || [])]);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (attachmentId: string) => {
    if (!taskId) throw new Error('Task ID is required');

    try {
      await taskViewService.deleteAttachment(taskId, attachmentId);
      setAttachments(prev => (prev || []).filter(att => att.id !== attachmentId));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete file');
    }
  };

  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  useEffect(() => {
    loadAttachments();
  }, [taskId]);

  return {
    attachments,
    loading,
    error,
    uploading,
    uploadFile,
    deleteFile,
    refresh: loadAttachments
  };
};
