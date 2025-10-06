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
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { id: projectId } = useParams<{ id: string }>();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    const params = projectId ? { project_id: projectId } : {};
    dispatch(fetchTasks(params));
  }, [dispatch, projectId]);

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

  return (
    <Box>
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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="all">All Priority</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
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
        <KanbanBoard projectId={projectId} />
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
