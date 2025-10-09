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
  Sort,
  SortByAlpha,
  Schedule,
  Flag,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchTasks, deleteTask } from '../store/taskSlice';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskListItem from '../components/tasks/TaskListItem';
import ForceRefreshButton from '../components/common/ForceRefreshButton';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

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
  const { tasks = [], loading = false, error = null } = useSelector((state: RootState) => state.tasks || {});
  const { id: projectId } = useParams<{ id: string }>();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [statusSelectOpen, setStatusSelectOpen] = useState(false);
  const [prioritySelectOpen, setPrioritySelectOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'priority' | 'due_date'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Auto-refresh setiap 30 detik untuk memastikan data terbaru
  useAutoRefresh({
    interval: 30000, // 30 detik
    enabled: true,
    params: {
      ...(projectId && { project_id: projectId }),
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      ...(statusFilter !== 'all' && { status: statusFilter }),
      ...(priorityFilter !== 'all' && { priority: priorityFilter }),
    },
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync tab value with status filter
  useEffect(() => {
    const statusMap = ['all', 'todo', 'in_progress', 'done', 'blocked'];
    const tabIndex = statusMap.indexOf(statusFilter);
    if (tabIndex !== -1 && tabIndex !== tabValue) {
      setTabValue(tabIndex);
    }
  }, [statusFilter, tabValue]);

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
    
    // Update status filter based on tab selection
    const statusMap = ['all', 'todo', 'in_progress', 'done', 'blocked'];
    const newStatus = statusMap[newValue];
    setStatusFilter(newStatus);
  };

  const handleEditTask = (task: any) => {
    // TODO: Implement edit task functionality
    console.log('Edit task:', task);
  };

  const handleDeleteTask = async (task: any) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(task.id)).unwrap();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleStatusChange = (task: any, newStatus: string) => {
    // TODO: Implement status change functionality
    console.log('Change status:', task, newStatus);
  };

  const filteredTasks = tasks.filter(task => {
    // Only apply frontend filtering for search and priority since status is handled by API
    const matchesSearch = !debouncedSearchTerm || 
                         (task.title || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         (task.description || '').toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
        break;
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        break;
      case 'due_date':
        aValue = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
        bValue = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
        break;
      case 'created_at':
      default:
        aValue = a.created_at ? new Date(a.created_at).getTime() : 0;
        bValue = b.created_at ? new Date(b.created_at).getTime() : 0;
        break;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusCounts = () => {
    // Always use all tasks for counts to show total available
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
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <ForceRefreshButton variant="icon" size="small" />
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

          {/* Sorting controls for List view */}
          {viewMode === 'list' && (
            <>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as any)}
                  MenuProps={{
                    disableEnforceFocus: true,
                    disableAutoFocus: true,
                    disableRestoreFocus: true,
                  }}
                >
                  <MenuItem value="created_at">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Sort />
                      Created Date
                    </Box>
                  </MenuItem>
                  <MenuItem value="title">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SortByAlpha />
                      Title
                    </Box>
                  </MenuItem>
                  <MenuItem value="priority">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Flag />
                      Priority
                    </Box>
                  </MenuItem>
                  <MenuItem value="due_date">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule />
                      Due Date
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order"
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  MenuProps={{
                    disableEnforceFocus: true,
                    disableAutoFocus: true,
                    disableRestoreFocus: true,
                  }}
                >
                  <MenuItem value="desc">Descending</MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
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
                  backgroundColor: tabValue === 0 ? 'primary.main' : 'grey.400', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: tabValue === 0 ? 'bold' : 'normal'
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
                  backgroundColor: tabValue === 1 ? 'grey.600' : 'grey.400', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: tabValue === 1 ? 'bold' : 'normal'
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
                  backgroundColor: tabValue === 2 ? 'info.main' : 'grey.400', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: tabValue === 2 ? 'bold' : 'normal'
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
                  backgroundColor: tabValue === 3 ? 'success.main' : 'grey.400', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: tabValue === 3 ? 'bold' : 'normal'
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
                  backgroundColor: tabValue === 4 ? 'error.main' : 'grey.400', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: tabValue === 4 ? 'bold' : 'normal'
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
              All Tasks ({sortedTasks.length})
            </Typography>
            {sortedTasks.length > 0 ? (
              <Box>
                {sortedTasks.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </Box>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tasks found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm || priorityFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Create your first task to get started'}
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              To Do Tasks ({sortedTasks.filter(t => t.status === 'todo').length})
            </Typography>
            {sortedTasks.filter(t => t.status === 'todo').length > 0 ? (
              <Box>
                {sortedTasks
                  .filter(t => t.status === 'todo')
                  .map((task) => (
                    <TaskListItem
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
              </Box>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No To Do tasks found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm || priorityFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'All tasks are in progress or completed'}
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              In Progress Tasks ({sortedTasks.filter(t => t.status === 'in_progress').length})
            </Typography>
            {sortedTasks.filter(t => t.status === 'in_progress').length > 0 ? (
              <Box>
                {sortedTasks
                  .filter(t => t.status === 'in_progress')
                  .map((task) => (
                    <TaskListItem
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
              </Box>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No In Progress tasks found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm || priorityFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'No tasks are currently in progress'}
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Done Tasks ({sortedTasks.filter(t => t.status === 'done').length})
            </Typography>
            {sortedTasks.filter(t => t.status === 'done').length > 0 ? (
              <Box>
                {sortedTasks
                  .filter(t => t.status === 'done')
                  .map((task) => (
                    <TaskListItem
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
              </Box>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Done tasks found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm || priorityFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'No tasks have been completed yet'}
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>
              Blocked Tasks ({sortedTasks.filter(t => t.status === 'blocked').length})
            </Typography>
            {sortedTasks.filter(t => t.status === 'blocked').length > 0 ? (
              <Box>
                {sortedTasks
                  .filter(t => t.status === 'blocked')
                  .map((task) => (
                    <TaskListItem
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
              </Box>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Blocked tasks found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm || priorityFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'No tasks are currently blocked'}
                </Typography>
              </Paper>
            )}
          </TabPanel>
        </Box>
      )}
    </Box>
  );
};

export default Tasks;
