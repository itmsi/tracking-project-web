import React, { useState } from 'react';
import { useTaskAttachments } from '../../hooks/useTaskAttachments';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { 
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  AudioFile as AudioIcon,
  Description as DocumentIcon,
  AttachFile as AttachIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNotifications } from '../../hooks/useNotifications';
import { canUploadToTask } from '../../utils/permissions';

const TaskAttachmentsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const AttachmentsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const UploadForm = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[50],
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[200]}`,
}));

interface TaskAttachmentsProps {
  taskId: string;
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
  permissions: {
    hasAccess?: boolean;
    userId?: string;
    isOwner: boolean;
    role: string;
    permissions?: {
      can_edit: boolean;
      can_comment: boolean;
      can_upload: boolean;
    };
  } | null;
  onUpdate?: () => void; // Callback untuk refresh data setelah update
}

const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ taskId, attachments: initialAttachments, permissions, onUpdate }) => {
  const {
    attachments,
    loading,
    error,
    uploading,
    uploadFile,
    deleteFile
  } = useTaskAttachments(taskId);

  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const { showNotification } = useNotifications();

  const canUpload = canUploadToTask(permissions);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      await uploadFile(selectedFile, {
        description: fileDescription,
        isPublic
      });
      
      setSelectedFile(null);
      setFileDescription('');
      setIsPublic(true);
      setShowUpload(false);
      showNotification('File uploaded successfully', 'success');
      
      // Refresh data setelah upload berhasil
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const handleDelete = async (attachmentId: string, fileName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    try {
      await deleteFile(attachmentId);
      showNotification('File deleted successfully', 'success');
      
      // Refresh data setelah delete berhasil
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <ImageIcon />;
      case 'video': return <VideoIcon />;
      case 'audio': return <AudioIcon />;
      case 'document': return <DocumentIcon />;
      default: return <AttachIcon />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (error) {
    return (
      <TaskAttachmentsContainer>
        <Alert severity="error">
          Error loading attachments: {error}
        </Alert>
      </TaskAttachmentsContainer>
    );
  }

  return (
    <TaskAttachmentsContainer>
      <AttachmentsHeader>
        <Typography variant="h6">
          Attachments
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="textSecondary">
            {attachments?.length || 0} files
          </Typography>
          {canUpload && (
            <Button 
              variant="outlined" 
              startIcon={<UploadIcon />}
              onClick={() => setShowUpload(!showUpload)}
              size="small"
            >
              Upload File
            </Button>
          )}
        </Box>
      </AttachmentsHeader>

      {showUpload && canUpload && (
        <UploadForm>
          <Box component="form" onSubmit={handleUpload} display="flex" flexDirection="column" gap={2}>
            <input
              type="file"
              onChange={handleFileSelect}
              required
              style={{ marginBottom: '8px' }}
            />
            
            <TextField
              fullWidth
              size="small"
              label="Description (optional)"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              placeholder="Describe this file..."
              variant="outlined"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              }
              label="Public (visible to all task members)"
            />

            <Box display="flex" gap={1}>
              <Button 
                type="submit" 
                variant="contained"
                disabled={!selectedFile || uploading}
                startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
              <Button 
                type="button" 
                variant="outlined"
                onClick={() => setShowUpload(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </UploadForm>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      ) : (attachments?.length || 0) === 0 ? (
        <Box textAlign="center" py={3}>
          <Typography color="textSecondary">
            No attachments yet
          </Typography>
        </Box>
      ) : (
        <List>
          {(attachments || []).map((attachment) => (
            <ListItem key={attachment.id} divider>
              <ListItemIcon>
                {getFileIcon(attachment.file_type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button 
                      variant="text" 
                      href={attachment.file_path} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                    >
                      {attachment.original_name}
                    </Button>
                    {!attachment.is_public && (
                      <Chip label="Private" size="small" color="warning" />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      {formatFileSize(attachment.file_size)} • {new Date(attachment.created_at).toLocaleDateString()} • by {attachment.uploader_first_name} {attachment.uploader_last_name}
                    </Typography>
                    {attachment.description && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {attachment.description}
                      </Typography>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Box display="flex" gap={1}>
                  <IconButton 
                    edge="end" 
                    href={attachment.file_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    size="small"
                  >
                    <DownloadIcon />
                  </IconButton>
                  {attachment.user_id === permissions?.userId && (
                    <IconButton 
                      edge="end" 
                      onClick={() => handleDelete(attachment.id, attachment.original_name)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </TaskAttachmentsContainer>
  );
};

export default TaskAttachments;
