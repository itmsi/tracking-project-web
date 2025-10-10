import React, { useState, useRef, useEffect } from 'react';
import { useTaskChat } from '../../hooks/useTaskChat';
import { 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Avatar, 
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Send as SendIcon, 
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNotifications } from '../../hooks/useNotifications';
import { canCommentOnTask } from '../../utils/permissions';

const TaskChatContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  height: '600px',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[100],
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[400],
    borderRadius: '3px',
  },
}));

const ChatMessage = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

const MessageContent = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const MessageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

const MessageText = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[50],
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  lineHeight: 1.4,
  border: `1px solid ${theme.palette.grey[200]}`,
}));

const ChatInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: 'auto',
}));

interface TaskChatProps {
  taskId: string;
  initialMessages: Array<{
    id: string;
    message: string;
    user_id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    is_edited: boolean;
    created_at: string;
    updated_at: string;
    attachments: Array<{
      id: string;
      name: string;
      url: string;
    }>;
  }>;
  permissions: {
    userId: string;
    isOwner: boolean;
    role: string;
    permissions: {
      can_edit: boolean;
      can_comment: boolean;
      can_upload: boolean;
    };
  };
}

const TaskChat: React.FC<TaskChatProps> = ({ taskId, initialMessages, permissions }) => {
  const {
    messages,
    loading,
    error,
    hasMore,
    sendMessage,
    updateMessage,
    deleteMessage,
    loadMore
  } = useTaskChat(taskId);

  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showNotification } = useNotifications();

  const canComment = canCommentOnTask(permissions);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !canComment) return;

    try {
      await sendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const handleEditMessage = async (messageId: string) => {
    try {
      await updateMessage(messageId, editText.trim());
      setEditingMessage(null);
      setEditText('');
      setAnchorEl(null);
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(messageId);
      setAnchorEl(null);
    } catch (error: any) {
      showNotification(error.message, 'error');
    }
  };

  const startEdit = (message: any) => {
    setEditingMessage(message.id);
    setEditText(message.message);
    setAnchorEl(null);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText('');
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, messageId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessageId(messageId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessageId(null);
  };

  if (error) {
    return (
      <TaskChatContainer>
        <Alert severity="error">
          Error loading chat: {error}
        </Alert>
      </TaskChatContainer>
    );
  }

  return (
    <TaskChatContainer>
      <ChatHeader>
        <Typography variant="h6">
          Task Chat
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {messages?.length || 0} messages
        </Typography>
      </ChatHeader>

      <ChatMessages>
        {hasMore && (
          <Box display="flex" justifyContent="center" mb={2}>
            <Button 
              variant="text" 
              onClick={loadMore}
              disabled={loading}
              size="small"
            >
              {loading ? <CircularProgress size={16} /> : 'Load more messages'}
            </Button>
          </Box>
        )}

        {(messages || []).map((message) => (
          <ChatMessage key={message.id}>
            <Avatar 
              src={message.avatar_url} 
              alt={[message.first_name, message.last_name].filter(Boolean).join(' ') || 'User'}
              sx={{ 
                width: 40, 
                height: 40,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 'bold'
              }}
            >
              {(message.first_name?.[0] || '') + (message.last_name?.[0] || '') || '?'}
            </Avatar>
            
            <MessageContent>
              <MessageHeader>
                <Typography variant="subtitle2" fontWeight={600}>
                  {[message.first_name, message.last_name].filter(Boolean).join(' ') || 'Unknown User'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {message.created_at ? new Date(message.created_at).toLocaleString() : '-'}
                </Typography>
                {message.is_edited && (
                  <Typography variant="caption" color="textSecondary" fontStyle="italic">
                    (edited)
                  </Typography>
                )}
                {message.user_id === permissions?.userId && (
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleMenuClick(e, message.id)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                )}
              </MessageHeader>

              {editingMessage === message.id ? (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <Box display="flex" gap={1} mt={1}>
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => handleEditMessage(message.id)}
                    >
                      Save
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <MessageText>
                  {message.message}
                </MessageText>
              )}

              {message.attachments && message.attachments.length > 0 && (
                <Box mt={1}>
                  {message.attachments.map((attachment, index) => (
                    <Box key={index} mb={0.5}>
                      <Button 
                        size="small" 
                        startIcon={<span>📎</span>}
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {attachment.name}
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </MessageContent>
          </ChatMessage>
        ))}
        
        <div ref={messagesEndRef} />
      </ChatMessages>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedMessageId && startEdit((messages || []).find(m => m.id === selectedMessageId))}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedMessageId && handleDeleteMessage(selectedMessageId)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {canComment && (
        <ChatInput>
          <Box component="form" onSubmit={handleSendMessage} display="flex" gap={1}>
            <TextField
            fullWidth
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            variant="outlined"
          />
          <Button 
            type="submit"
            variant="contained" 
            disabled={!newMessage.trim() || loading}
            startIcon={<SendIcon />}
            >
              Send
            </Button>
          </Box>
        </ChatInput>
      )}

      {!canComment && (
        <Alert severity="info">
          You don't have permission to comment on this task
        </Alert>
      )}
    </TaskChatContainer>
  );
};

export default TaskChat;
