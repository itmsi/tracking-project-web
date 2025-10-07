import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  FilterList,
  ViewKanban,
  ViewList,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchTasks } from '../store/taskSlice';
import KanbanBoard from '../components/tasks/KanbanBoard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tasks-tabpanel-${index}`}
      aria-labelledby={`tasks-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Tasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const { id: projectId } = useParams<{ id: string }>();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [statusSelectOpen, setStatusSelectOpen] = useState(false);
  const [prioritySelectOpen, setPrioritySelectOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle focus management for Select components
  useEffect(() => {
    const rootElement = document.getElementById('root');
    
    if (statusSelectOpen || prioritySelectOpen) {
      // Remove focus from any focused elements when selects are opened
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement !== document.body) {
        activeElement.blur();
      }
    } else {
      // Remove focus from any focused menu items when selects are closed
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.closest('.MuiMenu-root')) {
        activeElement.blur();
      }
      
      // Use inert attribute to prevent focus issues
      if (rootElement) {
        rootElement.removeAttribute('inert');
      }
    }

    // Cleanup function
    return () => {
      if (rootElement) {
        rootElement.removeAttribute('inert');
      }
    };
  }, [statusSelectOpen, prioritySelectOpen]);

  useEffect(() => {
    const params: any = {};
    if (projectId) params.project_id = projectId;
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (priorityFilter !== 'all') params.priority = priorityFilter;
    
    dispatch(fetchTasks(params));
  }, [dispatch, projectId, debouncedSearchTerm, statusFilter, priorityFilter]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = (task.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusCounts = () => {
    const counts = {
      all: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      blocked: tasks.filter(t => t.status === 'blocked').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading && tasks.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch({ type: 'tasks/clearError' })}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Tasks
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {projectId ? 'Manage project tasks' : 'Manage all your tasks'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={viewMode === 'kanban' ? 'contained' : 'outlined'}
            startIcon={<ViewKanban />}
            onClick={() => setViewMode('kanban')}
          >
            Kanban
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            startIcon={<ViewList />}
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', position: 'relative' }}>
          {loading && (
            <CircularProgress 
              size={20} 
              sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16,
                color: 'primary.main'
              }} 
            />
          )}
          <TextField
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              open={statusSelectOpen}
              onOpen={() => setStatusSelectOpen(true)}
              onClose={() => setStatusSelectOpen(false)}
              onChange={(e) => setStatusFilter(e.target.value)}
              MenuProps={{
                disableEnforceFocus: true,
                disableAutoFocus: true,
                disableRestoreFocus: true,
                disablePortal: false,
                onClose: () => {
                  setStatusSelectOpen(false);
                  // Force blur any focused menu items
                  setTimeout(() => {
                    const activeElement = document.activeElement as HTMLElement;
                    if (activeElement && activeElement.classList.contains('MuiMenuItem-root')) {
                      activeElement.blur();
                    }
                  }, 100);
                },
              }}
            >
              <MenuItem 
                value="all"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setStatusFilter('all');
                  setTimeout(() => setStatusSelectOpen(false), 50);
                }}
              >
                All Status
              </MenuItem>
              <MenuItem 
                value="todo"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setStatusFilter('todo');
                  setTimeout(() => setStatusSelectOpen(false), 50);
                }}
              >
                To Do
              </MenuItem>
              <MenuItem 
                value="in_progress"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setStatusFilter('in_progress');
                  setTimeout(() => setStatusSelectOpen(false), 50);
                }}
              >
                In Progress
              </MenuItem>
              <MenuItem 
                value="done"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setStatusFilter('done');
                  setTimeout(() => setStatusSelectOpen(false), 50);
                }}
              >
                Done
              </MenuItem>
              <MenuItem 
                value="blocked"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setStatusFilter('blocked');
                  setTimeout(() => setStatusSelectOpen(false), 50);
                }}
              >
                Blocked
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              open={prioritySelectOpen}
              onOpen={() => setPrioritySelectOpen(true)}
              onClose={() => setPrioritySelectOpen(false)}
              onChange={(e) => setPriorityFilter(e.target.value)}
              MenuProps={{
                disableEnforceFocus: true,
                disableAutoFocus: true,
                disableRestoreFocus: true,
                disablePortal: false,
                onClose: () => {
                  setPrioritySelectOpen(false);
                  // Force blur any focused menu items
                  setTimeout(() => {
                    const activeElement = document.activeElement as HTMLElement;
                    if (activeElement && activeElement.classList.contains('MuiMenuItem-root')) {
                      activeElement.blur();
                    }
                  }, 100);
                },
              }}
            >
              <MenuItem 
                value="all"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setPriorityFilter('all');
                  setTimeout(() => setPrioritySelectOpen(false), 50);
                }}
              >
                All Priority
              </MenuItem>
              <MenuItem 
                value="low"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setPriorityFilter('low');
                  setTimeout(() => setPrioritySelectOpen(false), 50);
                }}
              >
                Low
              </MenuItem>
              <MenuItem 
                value="medium"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setPriorityFilter('medium');
                  setTimeout(() => setPrioritySelectOpen(false), 50);
                }}
              >
                Medium
              </MenuItem>
              <MenuItem 
                value="high"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setPriorityFilter('high');
                  setTimeout(() => setPrioritySelectOpen(false), 50);
                }}
              >
                High
              </MenuItem>
              <MenuItem 
                value="urgent"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setPriorityFilter('urgent');
                  setTimeout(() => setPrioritySelectOpen(false), 50);
                }}
              >
                Urgent
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Status Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="task status tabs">
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                All Tasks
                <Typography variant="caption" sx={{ 
                  backgroundColor: 'primary.main', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.75rem'
                }}>
                  {statusCounts.all}
                </Typography>
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                To Do
                <Typography variant="caption" sx={{ 
                  backgroundColor: 'grey.500', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.75rem'
                }}>
                  {statusCounts.todo}
                </Typography>
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                In Progress
                <Typography variant="caption" sx={{ 
                  backgroundColor: 'info.main', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.75rem'
                }}>
                  {statusCounts.in_progress}
                </Typography>
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Done
                <Typography variant="caption" sx={{ 
                  backgroundColor: 'success.main', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.75rem'
                }}>
                  {statusCounts.done}
                </Typography>
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Blocked
                <Typography variant="caption" sx={{ 
                  backgroundColor: 'error.main', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.75rem'
                }}>
                  {statusCounts.blocked}
                </Typography>
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <KanbanBoard 
          projectId={projectId} 
          searchTerm={debouncedSearchTerm}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
        />
      ) : (
        <Box>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              All Tasks ({filteredTasks.length})
            </Typography>
            {/* List view implementation would go here */}
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                List view implementation coming soon...
              </Typography>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              To Do Tasks ({filteredTasks.filter(t => t.status === 'todo').length})
            </Typography>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                List view implementation coming soon...
              </Typography>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              In Progress Tasks ({filteredTasks.filter(t => t.status === 'in_progress').length})
            </Typography>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                List view implementation coming soon...
              </Typography>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Done Tasks ({filteredTasks.filter(t => t.status === 'done').length})
            </Typography>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                List view implementation coming soon...
              </Typography>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>
              Blocked Tasks ({filteredTasks.filter(t => t.status === 'blocked').length})
            </Typography>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                List view implementation coming soon...
              </Typography>
            </Paper>
          </TabPanel>
        </Box>
      )}
    </Box>
  );
};

export default Tasks;
