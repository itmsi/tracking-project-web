import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemSecondaryAction,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  AccountCircle,
  Settings,
  Logout,
  Notifications,
  Search,
  Task,
  Folder,
  Group,
  Comment,
  Close,
  MarkEmailRead,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { notificationsService, AppNotification } from '../../services/notifications';
import { useFocusManagement } from '../../hooks/useFocusManagement';
import { useAriaHiddenFix } from '../../hooks/useAriaHiddenFix';
import { useNotificationContext } from '../../contexts/NotificationContext';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Gunakan NotificationContext untuk mendapatkan data notifikasi
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch
  } = useNotificationContext();

  // Focus management untuk notification menu
  const notificationFocusManagement = useFocusManagement(Boolean(notificationAnchorEl));
  const accountFocusManagement = useFocusManagement(Boolean(anchorEl));

  // Fix aria-hidden issues
  useAriaHiddenFix(Boolean(notificationAnchorEl) || Boolean(anchorEl));

  // Update browser tab title saat ada notifikasi baru
  useEffect(() => {
    const originalTitle = 'Tracking Project Team';
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${originalTitle} - Ada Pesan Baru!`;
    } else {
      document.title = originalTitle;
    }
    
    return () => {
      document.title = originalTitle;
    };
  }, [unreadCount]);

  // Show toast notification saat unread count bertambah
  const prevUnreadCount = React.useRef(unreadCount);
  useEffect(() => {
    console.log('📊 Unread count changed:', {
      previous: prevUnreadCount.current,
      current: unreadCount,
      diff: unreadCount - prevUnreadCount.current
    });
    
    if (unreadCount > prevUnreadCount.current && unreadCount > 0) {
      const newNotifications = unreadCount - prevUnreadCount.current;
      console.log('🎉 Showing toast for', newNotifications, 'new notifications');
      setToastMessage(`🔔 Anda punya ${newNotifications} pesan baru!`);
      setShowToast(true);
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    // Refetch untuk memastikan data terbaru
    refetch();
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
      case 'task_completed':
      case 'task_due':
        return <Task />;
      case 'project_updated':
        return <Folder />;
      case 'team_invite':
        return <Group />;
      case 'comment_added':
      case 'chat_message':
      case 'reply':
      case 'mention':
        return <Comment />;
      default:
        return <Notifications />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return 'primary';
      case 'task_completed':
        return 'success';
      case 'task_due':
        return 'warning';
      case 'project_updated':
        return 'info';
      case 'team_invite':
        return 'secondary';
      case 'comment_added':
      case 'chat_message':
      case 'reply':
      case 'mention':
        return 'default';
      default:
        return 'default';
    }
  };

  // Handle notification click - navigate ke task detail
  const handleNotificationClick = async (notification: AppNotification) => {
    try {
      // Mark as read jika belum dibaca
      if (!notification.is_read) {
        await handleMarkAsRead(notification.id);
      }
      
      // Close dropdown
      handleNotificationClose();
      
      // Navigate based on notification type
      if (notification.type === 'chat_message' || notification.type === 'reply' || notification.type === 'mention') {
        // Untuk notifikasi chat, ambil task_id dari data
        const taskId = notification.data?.task_id || notification.related_id;
        if (taskId) {
          console.log('📍 Navigating to task:', taskId);
          navigate(`/tasks/${taskId}?tab=chat`);
        } else {
          console.warn('⚠️ Task ID not found in notification:', notification);
        }
      } else if (notification.related_type === 'task' && notification.related_id) {
        // Untuk notifikasi task lainnya
        navigate(`/tasks/${notification.related_id}`);
      } else if (notification.related_type === 'project' && notification.related_id) {
        // Untuk notifikasi project
        navigate(`/projects/${notification.related_id}`);
      } else if (notification.related_type === 'team' && notification.related_id) {
        // Untuk notifikasi team
        navigate(`/teams`);
      }
    } catch (err) {
      console.error('Error handling notification click:', err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Tracking Project Team
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" size="large">
            <Search />
          </IconButton>

          <IconButton 
            id="notification-button"
            color="inherit" 
            size="large"
            onClick={handleNotificationMenu}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-haspopup="true"
            aria-expanded={Boolean(notificationAnchorEl)}
            sx={{
              position: 'relative',
            }}
          >
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              max={99}
              showZero={false}
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '13px',
                  height: '24px',
                  minWidth: '24px',
                  fontWeight: 'bold',
                  padding: '0 6px',
                  animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                  boxShadow: unreadCount > 0 ? '0 0 15px rgba(244, 67, 54, 0.9)' : 'none',
                  border: unreadCount > 0 ? '2px solid white' : 'none',
                },
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.2)',
                    opacity: 0.85,
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                },
              }}
            >
              <Notifications 
                sx={{ 
                  fontSize: unreadCount > 0 ? 30 : 26,
                  transition: 'all 0.3s ease',
                  color: unreadCount > 0 ? '#ffeb3b' : 'white',
                }} 
              />
            </Badge>
          </IconButton>

          <IconButton
            id="account-button"
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar
              src={user?.avatar_url}
              sx={{ width: 32, height: 32 }}
            >
              {(user?.first_name?.[0] || '') + (user?.last_name?.[0] || '') || '?'}
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onKeyDown={accountFocusManagement.handleKeyDown}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                borderRadius: 2,
              },
            }}
            MenuListProps={{
              'aria-labelledby': 'account-button',
              role: 'menu',
            }}
            disableAutoFocusItem={false}
            autoFocus={true}
            disableEnforceFocus={true}
            disableRestoreFocus={true}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || '-'}
              </Typography>
            </Box>
            <Divider />
            
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profil</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Pengaturan</ListItemText>
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Keluar</ListItemText>
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            onKeyDown={notificationFocusManagement.handleKeyDown}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 350,
                maxWidth: 400,
                maxHeight: 500,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                borderRadius: 2,
              },
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            MenuListProps={{
              'aria-labelledby': 'notification-button',
              role: 'menu',
            }}
            slotProps={{
              root: {
                slotProps: {
                  backdrop: {
                    invisible: false,
                  },
                },
              },
            }}
            disableAutoFocusItem={false}
            autoFocus={true}
            disableEnforceFocus={true}
            disableRestoreFocus={true}
          >
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  Notifications
                </Typography>
                {notifications.some(n => !n.is_read) && (
                  <Button
                    size="small"
                    startIcon={<MarkEmailRead />}
                    onClick={handleMarkAllAsRead}
                  >
                    Mark All Read
                  </Button>
                )}
              </Box>
            </Box>

            {error && (
              <Box sx={{ px: 2, py: 1 }}>
                <Alert severity="error">
                  {error}
                </Alert>
              </Box>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            ) : (
              <List sx={{ maxHeight: 300, overflow: 'auto' }} role="menu">
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    disablePadding
                    sx={{
                      borderLeft: notification.is_read ? 'none' : '3px solid',
                      borderLeftColor: `${getNotificationColor(notification.type)}.main`,
                    }}
                  >
                    <ListItemButton
                      role="menuitem"
                      onClick={() => handleNotificationClick(notification)}
                      sx={{
                        bgcolor: notification.is_read ? 'transparent' : 'action.hover',
                        py: 1.5,
                        px: 2,
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          bgcolor: 'action.selected',
                          transform: 'translateX(2px)',
                          transition: 'all 0.2s ease-in-out'
                        },
                      }}
                    >
                      <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${getNotificationColor(notification.type)}.main`,
                          width: 36,
                          height: 36,
                          fontSize: '1rem',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight={notification.is_read ? 'normal' : 'bold'}>
                            {notification.title && !notification.title.includes('undefined') 
                              ? notification.title 
                              : notification.type === 'chat_message' 
                                ? 'Pesan baru dari pengguna'
                                : 'Notifikasi baru'
                            }
                          </Typography>
                          <Chip
                            label={notification.type.replace('_', ' ')}
                            size="small"
                            color={getNotificationColor(notification.type) as any}
                            variant="outlined"
                            sx={{ 
                              textTransform: 'capitalize',
                              fontSize: '0.7rem',
                              height: '20px'
                            }}
                          />
                        </Box>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                      secondary={
                        <>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              mb: 0.5,
                              lineHeight: 1.3,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {notification.message || 'Tidak ada pesan'}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: '0.7rem',
                              opacity: 0.8
                            }}
                          >
                            {new Date(notification.created_at).toLocaleString('id-ID', {
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {!notification.is_read && (
                          <IconButton
                            size="small"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Tandai sudah dibaca"
                            aria-label={`Mark notification "${notification.title}" as read`}
                            role="menuitem"
                            tabIndex={0}
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'primary.dark',
                              }
                            }}
                          >
                            <MarkEmailRead fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteNotification(notification.id)}
                          title="Hapus notifikasi"
                          color="error"
                          aria-label={`Delete notification "${notification.title}"`}
                          role="menuitem"
                          tabIndex={0}
                          sx={{
                            bgcolor: 'error.light',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'error.main',
                            }
                          }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Menu>
        </Box>
      </Toolbar>

      {/* Toast Notification untuk pesan baru */}
      <Snackbar
        open={showToast}
        autoHideDuration={4000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ 
          mt: 8,
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#f44336',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.5)',
          }
        }}
        message={toastMessage}
      />
    </AppBar>
  );
};

export default Header;
