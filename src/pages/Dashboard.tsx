import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Assignment,
  Folder,
  Group,
  TrendingUp,
  Add,
  MoreVert,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchProjects } from '../store/projectSlice';
import { fetchTasks } from '../store/taskSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { projects, loading: projectsLoading } = useSelector((state: RootState) => state.projects);
  const { tasks, loading: tasksLoading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchProjects({ limit: 5 }));
    dispatch(fetchTasks({ limit: 10 }));
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: <Folder />,
      color: '#3f51b5',
      change: '+12%',
    },
    {
      title: 'Active Tasks',
      value: tasks.filter(task => task.status !== 'done').length,
      icon: <Assignment />,
      color: '#f50057',
      change: '+8%',
    },
    {
      title: 'Team Members',
      value: 24,
      icon: <Group />,
      color: '#4caf50',
      change: '+5%',
    },
    {
      title: 'Completion Rate',
      value: '78%',
      icon: <TrendingUp />,
      color: '#ff9800',
      change: '+15%',
    },
  ];

  const recentTasks = tasks.slice(0, 5);
  const recentProjects = projects.slice(0, 3);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      todo: '#f3f4f6',
      in_progress: '#dbeafe',
      done: '#d1fae5',
      blocked: '#fee2e2',
    };
    return colors[status] || '#f3f4f6';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done',
      blocked: 'Blocked',
    };
    return texts[status] || status;
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Selamat datang, {user?.first_name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Berikut adalah ringkasan aktivitas proyek Anda hari ini.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        {stats.map((stat, index) => (
          <Box key={index}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                border: `1px solid ${stat.color}20`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" fontWeight="bold" color={stat.color}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {stat.title}
                    </Typography>
                    <Chip
                      label={stat.change}
                      size="small"
                      sx={{
                        backgroundColor: `${stat.color}20`,
                        color: stat.color,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Avatar
                    sx={{
                      backgroundColor: stat.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Recent Tasks */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Recent Tasks
                </Typography>
                <IconButton onClick={() => navigate('/tasks')}>
                  <MoreVert />
                </IconButton>
              </Box>

              {tasksLoading ? (
                <LinearProgress />
              ) : (
                <List>
                  {recentTasks.map((task) => (
                    <ListItem
                      key={task.id}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: getStatusColor(task.status),
                            color: 'text.primary',
                            width: 32,
                            height: 32,
                          }}
                        >
                          <Assignment fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={getStatusText(task.status)}
                              size="small"
                              component="span"
                              sx={{
                                backgroundColor: getStatusColor(task.status),
                                color: 'text.primary',
                                fontSize: '0.75rem',
                                display: 'inline-flex',
                              }}
                            />
                            <Typography variant="caption" color="text.secondary" component="span">
                              {task.due_date && new Date(task.due_date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <IconButton
                  onClick={() => navigate('/tasks')}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  <Add />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Projects */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Recent Projects
                </Typography>
                <IconButton onClick={() => navigate('/projects')}>
                  <MoreVert />
                </IconButton>
              </Box>

              {projectsLoading ? (
                <LinearProgress />
              ) : (
                <Box>
                  {recentProjects.map((project) => (
                    <Paper
                      key={project.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: project.color,
                          }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {project.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {project.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={project.status}
                          size="small"
                          color={
                            project.status === 'active' ? 'success' :
                            project.status === 'on_hold' ? 'warning' :
                            project.status === 'completed' ? 'info' : 'error'
                          }
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <IconButton
                  onClick={() => navigate('/projects')}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  <Add />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
