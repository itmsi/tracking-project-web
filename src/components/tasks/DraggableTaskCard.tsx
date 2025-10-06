import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Person,
  Schedule,
  Flag,
} from '@mui/icons-material';
import { Task } from '../../services/tasks';

interface DraggableTaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit?.(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(task);
    handleMenuClose();
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

  const getPriorityIcon = (priority: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      low: <Flag sx={{ fontSize: 16, color: '#10b981' }} />,
      medium: <Flag sx={{ fontSize: 16, color: '#f59e0b' }} />,
      high: <Flag sx={{ fontSize: 16, color: '#ef4444' }} />,
      urgent: <Flag sx={{ fontSize: 16, color: '#dc2626' }} />,
    };
    return icons[priority] || icons.medium;
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing',
        },
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        border: isOverdue ? '2px solid #ef4444' : '1px solid #e0e0e0',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ flexGrow: 1, pr: 1 }}>
            {task.title}
          </Typography>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ color: 'text.secondary' }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description.length > 100 
              ? `${task.description.substring(0, 100)}...` 
              : task.description
            }
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getPriorityIcon(task.priority)}
            <Chip
              label={task.priority}
              size="small"
              sx={{
                backgroundColor: getPriorityColor(task.priority),
                color: 'white',
                fontSize: '0.75rem',
                height: 20,
              }}
            />
          </Box>
          
          {task.assigned_to && (
            <Avatar
              src={task.assignee_avatar_url}
              sx={{ width: 24, height: 24 }}
            >
              {task.assignee_first_name?.[0]}{task.assignee_last_name?.[0]}
            </Avatar>
          )}
        </Box>

        {task.due_date && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <Schedule 
              fontSize="small" 
              sx={{ 
                color: isOverdue ? '#ef4444' : 'text.secondary',
                fontSize: 14 
              }} 
            />
            <Typography
              variant="caption"
              sx={{
                color: isOverdue ? '#ef4444' : 'text.secondary',
                fontWeight: isOverdue ? 600 : 400,
              }}
            >
              {new Date(task.due_date).toLocaleDateString()}
            </Typography>
            {isOverdue && (
              <Chip
                label="Overdue"
                size="small"
                sx={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontSize: '0.7rem',
                  height: 18,
                  ml: 1,
                }}
              />
            )}
          </Box>
        )}

        {task.checklist && task.checklist.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Checklist: {task.checklist.filter(item => item.completed).length}/{task.checklist.length}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 150,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default DraggableTaskCard;
