import React, { useState } from 'react';
import { taskViewService, TaskDetailsData } from '../../services/taskViewService';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNotifications } from '../../hooks/useNotifications';
import { canEditTask } from '../../utils/permissions';

const TaskDetailsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const TaskDetailsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const TaskDetailText = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[50],
  padding: theme.spacing(2),
  borderRadius: theme.spacing(0.5),
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
  minHeight: '60px',
  border: `1px solid ${theme.palette.grey[200]}`,
}));

interface TaskDetailsProps {
  taskId: string;
  details: {
    id: string;
    description: string;
    requirements: string;
    acceptance_criteria: string;
    created_at: string;
    updated_at: string;
  } | null;
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

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, details, permissions, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TaskDetailsData>({
    description: details?.description || '',
    requirements: details?.requirements || '',
    acceptance_criteria: details?.acceptance_criteria || ''
  });
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotifications();

  const canEdit = canEditTask(permissions);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (details) {
        console.log('📝 Updating task details...', formData);
        await taskViewService.updateTaskDetails(taskId, formData);
        console.log('✅ Task details updated successfully');
        showNotification('Task details updated successfully', 'success');
      } else {
        console.log('📝 Creating task details...', formData);
        await taskViewService.createTaskDetails(taskId, formData);
        console.log('✅ Task details created successfully');
        showNotification('Task details created successfully', 'success');
      }
      
      setIsEditing(false);
      
      // Refresh data setelah update berhasil
      if (onUpdate) {
        console.log('🔄 Calling onUpdate callback to refresh TaskView...');
        onUpdate();
      } else {
        console.warn('⚠️ onUpdate callback not provided!');
      }
    } catch (error: any) {
      console.error('❌ Failed to save task details:', error);
      showNotification(error.message || 'Failed to save task details', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      description: details?.description || '',
      requirements: details?.requirements || '',
      acceptance_criteria: details?.acceptance_criteria || ''
    });
    setIsEditing(false);
  };

  if (!canEdit && !details) {
    return (
      <TaskDetailsContainer>
        <Typography variant="h6" gutterBottom>
          Task Details
        </Typography>
        <Typography color="textSecondary">
          No details available
        </Typography>
      </TaskDetailsContainer>
    );
  }

  return (
    <TaskDetailsContainer>
      <TaskDetailsHeader>
        <Typography variant="h6">
          Task Details
        </Typography>
        {canEdit && (
          <Box display="flex" gap={1}>
            {isEditing ? (
              <>
                <Button 
                  variant="contained" 
                  startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                  size="small"
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={saving}
                  size="small"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                size="small"
              >
                Edit Details
              </Button>
            )}
          </Box>
        )}
      </TaskDetailsHeader>

      <Box display="flex" flexDirection="column" gap={3}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Description
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description..."
              variant="outlined"
            />
          ) : (
            <TaskDetailText>
              {details?.description || 'No description provided'}
            </TaskDetailText>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Requirements
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              rows={6}
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="Enter requirements..."
              variant="outlined"
            />
          ) : (
            <TaskDetailText>
              {details?.requirements || 'No requirements specified'}
            </TaskDetailText>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Acceptance Criteria
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              multiline
              rows={6}
              value={formData.acceptance_criteria}
              onChange={(e) => setFormData(prev => ({ ...prev, acceptance_criteria: e.target.value }))}
              placeholder="Enter acceptance criteria..."
              variant="outlined"
            />
          ) : (
            <TaskDetailText>
              {details?.acceptance_criteria || 'No acceptance criteria defined'}
            </TaskDetailText>
          )}
        </Box>
      </Box>
    </TaskDetailsContainer>
  );
};

export default TaskDetails;
