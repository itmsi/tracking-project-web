import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskView } from '../../hooks/useTaskView';
import TaskDetails from './TaskDetails';
import TaskChatWebSocket from './TaskChatWebSocket';
import TaskAttachments from './TaskAttachments';
import TaskMembers from './TaskMembers';
import { Box, CircularProgress, Alert, Typography, Paper, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getStatusColor } from '../../utils/permissions';
import '../../styles/TaskView.css';
import '../../styles/WebSocketChat.css';

const TaskViewContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1200,
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const TaskHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
}));

const TaskContent = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 300px',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const TaskMain = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const TaskSidebar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    order: -1,
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  textTransform: 'uppercase',
}));

const TaskViewPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { taskView, loading, error, refetch } = useTaskView(taskId || null);

  // Debugging logs - log setiap render
  useEffect(() => {
    console.log('📋 TaskViewPage render state:', { 
      taskId, 
      loading, 
      error, 
      hasTaskView: !!taskView,
      taskView 
    });
  }, [taskId, loading, error, taskView]);

  if (loading) {
    console.log('⏳ TaskViewPage: Showing loading state');
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px" gap={2}>
        <CircularProgress />
        <Typography variant="body2" color="textSecondary">
          Loading task details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    console.log('❌ TaskViewPage: Showing error state:', error);
    return (
      <TaskViewContainer>
        <Alert severity="error" action={
          <button onClick={() => refetch()} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            Retry
          </button>
        }>
          {error}
        </Alert>
      </TaskViewContainer>
    );
  }

  if (!taskView) {
    console.log('⚠️ TaskViewPage: taskView is null/undefined');
    return (
      <TaskViewContainer>
        <Alert severity="warning">
          No task data available. <button onClick={() => refetch()} style={{ marginLeft: '8px', cursor: 'pointer' }}>Refresh</button>
        </Alert>
      </TaskViewContainer>
    );
  }

  if (!taskView.task) {
    console.log('⚠️ TaskViewPage: taskView.task is missing', { taskView });
    return (
      <TaskViewContainer>
        <Alert severity="error">
          Invalid task data structure. Please contact support.
        </Alert>
      </TaskViewContainer>
    );
  }

  const { task, details, members, attachments, user_permissions, chat } = taskView;
  console.log('✅ TaskViewPage: Rendering with data:', { 
    task: task?.title, 
    hasDetails: !!details, 
    memberCount: members?.length,
    attachmentCount: attachments?.length,
    chatMessageCount: chat?.messages?.length || 0,
    permissions: user_permissions 
  });


  return (
    <TaskViewContainer>
      <TaskHeader>
        <Typography variant="h4" component="h1" gutterBottom>
          {task.title || 'Untitled Task'}
        </Typography>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <StatusChip 
            label={task.status || 'unknown'} 
            color={getStatusColor(task.status || 'unknown') as any}
            size="small"
          />
          <Chip 
            label={`Priority: ${task.priority || 'medium'}`} 
            variant="outlined" 
            size="small"
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
          />
          {task.due_date && (
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Due: {new Date(task.due_date).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </TaskHeader>

      <TaskContent>
        <TaskMain>
          <TaskDetails 
            taskId={taskId!} 
            details={details || null} 
            permissions={user_permissions || null}
            onUpdate={refetch}
          />
          <TaskChatWebSocket 
            taskId={taskId!} 
            permissions={user_permissions || null}
            initialMessages={chat?.messages || []}
          />
        </TaskMain>

        <TaskSidebar>
          <TaskMembers 
            taskId={taskId!} 
            members={members || []}
            permissions={user_permissions || null}
            onUpdate={refetch}
          />
          <TaskAttachments 
            taskId={taskId!} 
            attachments={attachments || []}
            permissions={user_permissions || null}
            onUpdate={refetch}
          />
        </TaskSidebar>
      </TaskContent>
    </TaskViewContainer>
  );
};

export default TaskViewPage;
