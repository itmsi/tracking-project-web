import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Person,
  Schedule,
  Flag,
  Assignment,
  Visibility,
} from '@mui/icons-material';
import { Task } from '../../services/tasks';

interface TaskListItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onStatusChange?: (task: Task, newStatus: string) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(task);
    handleClose();
  };

  const handleDelete = () => {
    onDelete?.(task);
    handleClose();
  };

  const handleViewTask = () => {
    navigate(`/tasks/${task.id}`);
    handleClose();
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      urgent: '#dc2626',
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      todo: '#6b7280',
      in_progress: '#3b82f6',
      done: '#10b981',
      blocked: '#ef4444',
    };
    return colors[status] || colors.todo;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done',
      blocked: 'Blocked',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
              {task.title}
            </Typography>
            
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                {task.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                label={getStatusLabel(task.status)}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(task.status),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              <Chip
                icon={<Flag />}
                label={task.priority}
                size="small"
                sx={{
                  backgroundColor: getPriorityColor(task.priority),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              {task.assigned_to && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                    {task.assignee_first_name?.[0] || 'U'}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {task.assignee_first_name} {task.assignee_last_name}
                  </Typography>
                </Box>
              )}

              {task.due_date && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography 
                    variant="body2" 
                    color={isOverdue(task.due_date) ? 'error.main' : 'text.secondary'}
                    sx={{ fontWeight: isOverdue(task.due_date) ? 'bold' : 'normal' }}
                  >
                    Due: {formatDate(task.due_date)}
                    {isOverdue(task.due_date) && ' (Overdue)'}
                  </Typography>
                </Box>
              )}

            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {task.created_at && new Date(task.created_at).toLocaleDateString()}
            </Typography>
            
            <Tooltip title="More actions">
              <IconButton
                size="small"
                onClick={handleClick}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              disableEnforceFocus
              disableAutoFocus
              disableRestoreFocus
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleViewTask}>
                <Visibility sx={{ mr: 1, fontSize: 16 }} />
                View Task Details
              </MenuItem>
              <MenuItem onClick={handleEdit}>
                <Edit sx={{ mr: 1, fontSize: 16 }} />
                Edit Task
              </MenuItem>
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <Delete sx={{ mr: 1, fontSize: 16 }} />
                Delete Task
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskListItem;
