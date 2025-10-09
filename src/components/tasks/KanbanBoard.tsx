import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Person,
  Schedule,
  Flag,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchTasks, createTask, updateTaskStatus } from '../../store/taskSlice';
import { Task } from '../../services/tasks';
import DraggableTaskCard from './DraggableTaskCard';
import DroppableColumn from './DroppableColumn';
import ForceRefreshButton from '../common/ForceRefreshButton';

interface KanbanBoardProps {
  projectId?: string;
  searchTerm?: string;
  statusFilter?: string;
  priorityFilter?: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  projectId, 
  searchTerm, 
  statusFilter, 
  priorityFilter 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks = [] } = useSelector((state: RootState) => state.tasks || {});
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<'todo' | 'in_progress' | 'done' | 'blocked'>('todo');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    assigned_to: '',
    due_date: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: 'todo', title: 'To Do', color: '#f3f4f6', icon: '📋' },
    { id: 'in_progress', title: 'In Progress', color: '#dbeafe', icon: '⚡' },
    { id: 'done', title: 'Done', color: '#d1fae5', icon: '✅' },
    { id: 'blocked', title: 'Blocked', color: '#fee2e2', icon: '🚫' },
  ];

  useEffect(() => {
    const params: any = {};
    if (projectId) params.project_id = projectId;
    if (searchTerm) params.search = searchTerm;
    if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
    if (priorityFilter && priorityFilter !== 'all') params.priority = priorityFilter;
    
    dispatch(fetchTasks(params));
  }, [dispatch, projectId, searchTerm, statusFilter, priorityFilter]);

  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    done: tasks.filter(task => task.status === 'done'),
    blocked: tasks.filter(task => task.status === 'blocked'),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // This function is not needed for our current implementation
    // The drag and drop is handled in handleDragEnd
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;

    if (activeContainer && overContainer && activeContainer !== overContainer) {
      // Update task status
      try {
        await dispatch(updateTaskStatus({
          id: activeId,
          status: overContainer,
          position: 0,
        })).unwrap();
      } catch (error) {
        console.error('Failed to update task status:', error);
        // Reload tasks on error
        dispatch(fetchTasks(projectId ? { project_id: projectId } : {}));
      }
    }
  };

  const findContainer = (id: string) => {
    if (id in tasksByStatus) {
      return id;
    }

    return Object.keys(tasksByStatus).find((key) =>
      tasksByStatus[key as keyof typeof tasksByStatus].some((task) => task.id === id)
    );
  };

  const handleOpenDialog = (columnId: string) => {
    setSelectedColumn(columnId as 'todo' | 'in_progress' | 'done' | 'blocked');
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      assigned_to: '',
      due_date: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = () => {
    const taskData = {
      ...formData,
      project_id: projectId,
      status: selectedColumn,
    };
    dispatch(createTask(taskData));
    handleCloseDialog();
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

  return (
    <Box sx={{ p: 2 }}>
      {/* Force Refresh Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ForceRefreshButton 
          variant="button" 
          size="small"
          onRefresh={() => {
            const params: any = {};
            if (projectId) params.project_id = projectId;
            if (searchTerm) params.search = searchTerm;
            if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
            if (priorityFilter && priorityFilter !== 'all') params.priority = priorityFilter;
            dispatch(fetchTasks(params));
          }}
        />
      </Box>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box display="flex" gap={2} sx={{ minHeight: 600 }}>
          {columns.map((column) => (
            <Paper
              key={column.id}
              sx={{
                flex: 1,
                p: 2,
                backgroundColor: column.color,
                borderRadius: 3,
                minHeight: 600,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {column.icon} {column.title}
                  </Typography>
                  <Chip
                    label={tasksByStatus[column.id as keyof typeof tasksByStatus].length}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(column.id)}
                  sx={{
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'grey.100' },
                  }}
                >
                  <Add />
                </IconButton>
              </Box>

              <DroppableColumn id={column.id}>
                <SortableContext
                  items={tasksByStatus[column.id as keyof typeof tasksByStatus].map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
                    {tasksByStatus[column.id as keyof typeof tasksByStatus].map((task) => (
                      <DraggableTaskCard key={task.id} task={task} />
                    ))}
                  </Box>
                </SortableContext>
              </DroppableColumn>
            </Paper>
          ))}
        </Box>

        <DragOverlay>
          {activeTask ? (
            <Card
              sx={{
                width: 300,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                transform: 'rotate(5deg)',
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {activeTask.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={activeTask.priority}
                    size="small"
                    sx={{
                      backgroundColor: getPriorityColor(activeTask.priority),
                      color: 'white',
                    }}
                  />
                  {activeTask.assigned_to && (
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {activeTask.assignee_first_name?.[0]}
                    </Avatar>
                  )}
                </Box>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Create Task Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        disableEnforceFocus
        disableAutoFocus
      >
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  MenuProps={{
                    disableEnforceFocus: true,
                    disableAutoFocus: true,
                    disableRestoreFocus: true,
                  }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Due Date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #303f9f 0%, #3f51b5 100%)',
          },
        }}
        onClick={() => handleOpenDialog('todo')}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default KanbanBoard;
