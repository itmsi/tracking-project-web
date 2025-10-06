import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Avatar,
  AvatarGroup,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Group,
  CalendarToday,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../services/projects';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewTasks = () => {
    navigate(`/projects/${project.id}/tasks`);
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit(project);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(project);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: 'success' | 'warning' | 'info' | 'error' } = {
      active: 'success',
      on_hold: 'warning',
      completed: 'info',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      active: 'Active',
      on_hold: 'On Hold',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return texts[status] || status;
  };

  const calculateProgress = () => {
    // Mock progress calculation - in real app, this would come from API
    return Math.floor(Math.random() * 100);
  };

  const progress = calculateProgress();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: project.color,
              }}
            />
            <Typography variant="h6" component="h2" fontWeight="bold">
              {project.name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ color: 'text.secondary' }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
          {project.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" fontWeight="bold">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                backgroundColor: project.color,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Group fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {project.members || 0} members
            </Typography>
          </Box>
          <Chip
            label={getStatusText(project.status)}
            color={getStatusColor(project.status)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {project.team_name && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Group fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              Team: {project.team_name}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarToday fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
          </Typography>
        </Box>

        <AvatarGroup max={3} sx={{ mt: 2, justifyContent: 'flex-start' }}>
          {/* Mock avatars - in real app, these would be project members */}
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>JD</Avatar>
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>SM</Avatar>
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>AB</Avatar>
        </AvatarGroup>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          onClick={handleViewTasks}
          sx={{ fontWeight: 600 }}
        >
          View Tasks
        </Button>
        <Button
          size="small"
          onClick={() => navigate(`/projects/${project.id}`)}
          sx={{ fontWeight: 600 }}
        >
          Details
        </Button>
      </CardActions>

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
        <MenuItem onClick={handleViewTasks}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Tasks
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default ProjectCard;
